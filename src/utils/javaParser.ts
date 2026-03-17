interface Pose2dData {
  x: number;
  y: number;
  heading: number;
}

interface SplineSegment {
  type: "linear" | "tangential";
  start: Pose2dData;
  end: Pose2dData;
  controlPoints: { x: number; y: number }[];
}

export function parseJavaCode(javaCode: string): { startPoint: Point; lines: Line[] } | null {
  try {
    const segments = parseSplineSegments(javaCode);

    if (segments.length < 1) {
      return null;
    }

    const firstSegment = segments[0];
    const startPoint: Point = {
      x: firstSegment.start.x,
      y: firstSegment.start.y,
      heading: "linear",
      startDeg: radiansToDegrees(firstSegment.start.heading),
      endDeg: radiansToDegrees(firstSegment.start.heading)
    };

    const lines: Line[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const controlPoints = generateQuinticControlPoints(segment);

      const heading: any = segment.type === "tangential"
        ? { heading: "tangential", reverse: false }
        : {
            heading: "linear",
            startDeg: radiansToDegrees(segment.start.heading),
            endDeg: radiansToDegrees(segment.end.heading)
          };

      lines.push({
        endPoint: {
          x: segment.end.x,
          y: segment.end.y,
          ...heading
        },
        controlPoints: controlPoints,
        color: getRandomColor()
      });
    }

    return { startPoint, lines };
  } catch (error) {
    console.error("Error parsing Java code:", error);
    return null;
  }
}

function parseSplineSegments(javaCode: string): SplineSegment[] {
  const segments: SplineSegment[] = [];

  const extractPose2dFromString = (str: string): Pose2dData | null => {
    const match = /new\s+Pose2d\s*\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*,\s*(?:Math\.toRadians\s*\(\s*)?([-+]?\d+(?:\.\d+)?)\s*\)?\s*\)/.exec(str);
    if (!match) return null;

    let heading = parseFloat(match[3]);
    if (str.substring(match.index, match.index + match[0].length).includes('Math.toRadians')) {
      heading = degreesToRadians(heading);
    }

    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      heading: heading
    };
  };

  const getAllPose2ds = (str: string): Pose2dData[] => {
    const poses: Pose2dData[] = [];
    const pattern = /new\s+Pose2d\s*\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*,\s*(?:Math\.toRadians\s*\(\s*)?([-+]?\d+(?:\.\d+)?)\s*\)?\s*\)/g;
    let match;
    while ((match = pattern.exec(str)) !== null) {
      let heading = parseFloat(match[3]);
      if (str.substring(match.index, match.index + match[0].length).includes('Math.toRadians')) {
        heading = degreesToRadians(heading);
      }
      poses.push({
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        heading: heading
      });
    }
    return poses;
  };

  const linearMatches: Array<{ str: string; index: number }> = [];
  const tangentialMatches: Array<{ str: string; index: number }> = [];

  const linearRegex = /new\s+LinearSpline\s*\([^]*?\)/;
  const tangentialRegex = /new\s+TangentialSpline\s*\([^]*?\)/;

  let linearIndex = 0;
  let tangentialIndex = 0;

  for (let i = 0; i < javaCode.length; i++) {
    if (javaCode.substring(i).startsWith('new LinearSpline')) {
      let depth = 0;
      let start = i;
      let found = false;
      for (let j = i; j < javaCode.length; j++) {
        if (javaCode[j] === '(') depth++;
        if (javaCode[j] === ')') {
          depth--;
          if (depth === 0) {
            linearMatches.push({
              str: javaCode.substring(start, j + 1),
              index: start
            });
            found = true;
            break;
          }
        }
      }
      if (found) i += 20;
    }

    if (javaCode.substring(i).startsWith('new TangentialSpline')) {
      let depth = 0;
      let start = i;
      let found = false;
      for (let j = i; j < javaCode.length; j++) {
        if (javaCode[j] === '(') depth++;
        if (javaCode[j] === ')') {
          depth--;
          if (depth === 0) {
            tangentialMatches.push({
              str: javaCode.substring(start, j + 1),
              index: start
            });
            found = true;
            break;
          }
        }
      }
      if (found) i += 23;
    }
  }

  const allMatches = [
    ...linearMatches.map(m => ({ ...m, type: 'linear' as const })),
    ...tangentialMatches.map(m => ({ ...m, type: 'tangential' as const }))
  ].sort((a, b) => a.index - b.index);

  if (allMatches.length > 0) {
    for (const match of allMatches) {
      const poses = getAllPose2ds(match.str);
      if (poses.length === 2) {
        segments.push({
          type: match.type,
          start: poses[0],
          end: poses[1],
          controlPoints: []
        });
      }
    }
    return segments;
  }

  const allPoses = getAllPose2ds(javaCode);
  if (allPoses.length >= 2) {
    for (let i = 1; i < allPoses.length; i++) {
      segments.push({
        type: "linear",
        start: allPoses[i - 1],
        end: allPoses[i],
        controlPoints: []
      });
    }
  }

  return segments;
}

function generateQuinticControlPoints(segment: SplineSegment): { x: number; y: number }[] {
  if (segment.type === "linear") {
    return [];
  }

  const p0 = { x: segment.start.x, y: segment.start.y };
  const p1 = { x: segment.end.x, y: segment.end.y };

  const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const scale = dist * 1.2;

  const v0 = {
    x: Math.cos(segment.start.heading) * scale,
    y: Math.sin(segment.start.heading) * scale
  };

  const v1 = {
    x: Math.cos(segment.end.heading) * scale,
    y: Math.sin(segment.end.heading) * scale
  };

  const samples = 50;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;

    const c5x = p0.x * (-6) - v0.x * 3 + p1.x * 6 - v1.x * 3;
    const c5y = p0.y * (-6) - v0.y * 3 + p1.y * 6 - v1.y * 3;
    const c4x = p0.x * 15 + v0.x * 8 - p1.x * 15 + v1.x * 7;
    const c4y = p0.y * 15 + v0.y * 8 - p1.y * 15 + v1.y * 7;
    const c3x = p0.x * (-10) - v0.x * 6 + p1.x * 10 - v1.x * 4;
    const c3y = p0.y * (-10) - v0.y * 6 + p1.y * 10 - v1.y * 4;

    const px = c5x * t5 + c4x * t4 + c3x * t3 + v0.x * t + p0.x;
    const py = c5y * t5 + c4y * t4 + c3y * t3 + v0.y * t + p0.y;

    points.push({ x: px, y: py });
  }

  const cp1 = {
    x: p0.x + v0.x * 0.25,
    y: p0.y + v0.y * 0.25
  };

  const cp2 = {
    x: p1.x - v1.x * 0.25,
    y: p1.y - v1.y * 0.25
  };

  return [cp1, cp2];
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function getRandomColor() {
  var letters = "56789ABCD";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
