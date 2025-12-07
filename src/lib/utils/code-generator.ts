/**
 * Code Generator for Animations
 * Exports animations in various formats: Standalone HTML, React Component, Vanilla JS
 */

import type { Animation, AnimationContext, AnimationMetadata } from '../../types/animation'

export interface CodeGeneratorOptions {
  format: 'html' | 'react' | 'vanilla'
  includeComments?: boolean
  minify?: boolean
}

export interface GeneratedCode {
  code: string
  filename: string
  language: 'html' | 'tsx' | 'javascript'
}

/**
 * Generate code for an animation in specified format
 */
export function generateCode(
  animation: Animation,
  metadata: AnimationMetadata,
  context: AnimationContext,
  options: CodeGeneratorOptions = { format: 'html', includeComments: true }
): GeneratedCode {
  switch (options.format) {
    case 'html':
      return generateHTML(animation, metadata, context, options)
    case 'react':
      return generateReact(animation, metadata, context, options)
    case 'vanilla':
      return generateVanillaJS(animation, metadata, context, options)
    default:
      throw new Error(`Unknown format: ${options.format}`)
  }
}

/**
 * Generate standalone HTML file with inline JavaScript
 */
function generateHTML(
  animation: Animation,
  metadata: AnimationMetadata,
  context: AnimationContext,
  options: CodeGeneratorOptions
): GeneratedCode {
  const { includeComments = true } = options
  const params = stringifyParameters(context.params || {})

  const comment = includeComments
    ? `<!-- 
  Animation: ${metadata.name}
  Description: ${metadata.description}
  Generated from Brain-Rot Canvas Gallery
-->\n`
    : ''

  const code = `${comment}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      overflow: hidden;
      background: #000;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    ${includeComments ? '// Animation parameters\n    ' : ''}const params = ${params};

    ${includeComments ? '// Canvas setup\n    ' : ''}const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ${includeComments ? '// Handle high DPI displays\n    ' : ''}function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ${includeComments ? '// Animation state\n    ' : ''}let animationState = null;

    ${includeComments ? '// Initialize animation\n    ' : ''}function init() {
      const context = {
        canvas,
        ctx,
        width: window.innerWidth,
        height: window.innerHeight,
        params,
        time: 0,
        deltaTime: 0,
        fps: 60
      };
      animationState = ${extractInitCode(animation)};
    }

    ${includeComments ? '// Update animation\n    ' : ''}function update(time, deltaTime) {
      const context = {
        canvas,
        ctx,
        width: window.innerWidth,
        height: window.innerHeight,
        params,
        time: time / 1000,
        deltaTime: deltaTime / 1000,
        fps: 1000 / deltaTime
      };
      ${extractUpdateCode(animation)}
    }

    ${includeComments ? '// Render animation\n    ' : ''}function render() {
      const context = {
        canvas,
        ctx,
        width: window.innerWidth,
        height: window.innerHeight,
        params,
        time: performance.now() / 1000,
        deltaTime: 0,
        fps: 60
      };
      ${extractRenderCode(animation)}
    }

    ${includeComments ? '// Animation loop\n    ' : ''}let lastTime = 0;
    function animate(currentTime) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      update(currentTime, deltaTime);
      render();

      requestAnimationFrame(animate);
    }

    ${includeComments ? '// Start animation\n    ' : ''}init();
    requestAnimationFrame(animate);
  </script>
</body>
</html>`

  return {
    code,
    filename: `${toKebabCase(metadata.name)}.html`,
    language: 'html',
  }
}

/**
 * Generate React component
 */
function generateReact(
  animation: Animation,
  metadata: AnimationMetadata,
  context: AnimationContext,
  options: CodeGeneratorOptions
): GeneratedCode {
  const { includeComments = true } = options
  const params = stringifyParameters(context.params || {})

  const comment = includeComments
    ? `/**
 * ${metadata.name}
 * ${metadata.description}
 * Generated from Brain-Rot Canvas Gallery
 */\n\n`
    : ''

  const code = `${comment}import { useEffect, useRef } from 'react';

export interface ${toPascalCase(metadata.name)}Props {
  className?: string;
  params?: Record<string, unknown>;
}

export function ${toPascalCase(metadata.name)}({ className, params: propParams }: ${toPascalCase(metadata.name)}Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ${includeComments ? '// Merge provided params with defaults\n    ' : ''}const params = { ...${params}, ...propParams };

    ${includeComments ? '// Handle high DPI displays\n    ' : ''}function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ${includeComments ? '// Animation state\n    ' : ''}let animationState: any = null;

    ${includeComments ? '// Initialize animation\n    ' : ''}function init() {
      const context = {
        canvas,
        ctx,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        params,
        time: 0,
        deltaTime: 0,
        fps: 60
      };
      animationState = ${extractInitCode(animation)};
    }

    ${includeComments ? '// Update animation\n    ' : ''}function update(time: number, deltaTime: number) {
      const context = {
        canvas,
        ctx,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        params,
        time: time / 1000,
        deltaTime: deltaTime / 1000,
        fps: 1000 / deltaTime
      };
      ${extractUpdateCode(animation)}
    }

    ${includeComments ? '// Render animation\n    ' : ''}function render() {
      const context = {
        canvas,
        ctx,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        params,
        time: performance.now() / 1000,
        deltaTime: 0,
        fps: 60
      };
      ${extractRenderCode(animation)}
    }

    ${includeComments ? '// Animation loop\n    ' : ''}let lastTime = 0;
    let animationId: number;

    function animate(currentTime: number) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      update(currentTime, deltaTime);
      render();

      animationId = requestAnimationFrame(animate);
    }

    ${includeComments ? '// Start animation\n    ' : ''}init();
    animationId = requestAnimationFrame(animate);

    ${includeComments ? '// Cleanup\n    ' : ''}return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [propParams]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default ${toPascalCase(metadata.name)};`

  return {
    code,
    filename: `${toPascalCase(metadata.name)}.tsx`,
    language: 'tsx',
  }
}

/**
 * Generate vanilla JavaScript module
 */
function generateVanillaJS(
  animation: Animation,
  metadata: AnimationMetadata,
  context: AnimationContext,
  options: CodeGeneratorOptions
): GeneratedCode {
  const { includeComments = true } = options
  const params = stringifyParameters(context.params || {})

  const comment = includeComments
    ? `/**
 * ${metadata.name}
 * ${metadata.description}
 * Generated from Brain-Rot Canvas Gallery
 */\n\n`
    : ''

  const code = `${comment}export class ${toPascalCase(metadata.name)}Animation {
  constructor(canvas, customParams = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.params = { ...${params}, ...customParams };
    this.animationState = null;
    this.lastTime = 0;
    this.animationId = null;

    ${includeComments ? '// Bind methods\n    ' : ''}this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.resize = this.resize.bind(this);

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  ${includeComments ? '/**\n   * Handle high DPI displays and canvas resizing\n   */\n  ' : ''}resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  ${includeComments ? '/**\n   * Initialize animation state\n   */\n  ' : ''}init() {
    const context = {
      canvas: this.canvas,
      ctx: this.ctx,
      width: this.canvas.offsetWidth,
      height: this.canvas.offsetHeight,
      params: this.params,
      time: 0,
      deltaTime: 0,
      fps: 60
    };
    this.animationState = ${extractInitCode(animation)};
  }

  ${includeComments ? '/**\n   * Update animation logic\n   */\n  ' : ''}update(time, deltaTime) {
    const context = {
      canvas: this.canvas,
      ctx: this.ctx,
      width: this.canvas.offsetWidth,
      height: this.canvas.offsetHeight,
      params: this.params,
      time: time / 1000,
      deltaTime: deltaTime / 1000,
      fps: 1000 / deltaTime
    };
    ${extractUpdateCode(animation)}
  }

  ${includeComments ? '/**\n   * Render animation frame\n   */\n  ' : ''}render() {
    const context = {
      canvas: this.canvas,
      ctx: this.ctx,
      width: this.canvas.offsetWidth,
      height: this.canvas.offsetHeight,
      params: this.params,
      time: performance.now() / 1000,
      deltaTime: 0,
      fps: 60
    };
    ${extractRenderCode(animation)}
  }

  ${includeComments ? '/**\n   * Animation loop\n   */\n  ' : ''}animate(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(currentTime, deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.animate);
  }

  ${includeComments ? '/**\n   * Start animation\n   */\n  ' : ''}start() {
    if (this.animationId !== null) return;
    this.init();
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.animate);
  }

  ${includeComments ? '/**\n   * Stop animation\n   */\n  ' : ''}stop() {
    if (this.animationId === null) return;
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  ${includeComments ? '/**\n   * Update parameters\n   */\n  ' : ''}updateParams(newParams) {
    this.params = { ...this.params, ...newParams };
  }

  ${includeComments ? '/**\n   * Cleanup\n   */\n  ' : ''}destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}

${includeComments ? '// Usage example:\n// ' : ''}const canvas = document.getElementById('canvas');
${includeComments ? '// ' : ''}const animation = new ${toPascalCase(animation.name)}Animation(canvas);
${includeComments ? '// ' : ''}animation.start();`

  return {
    code,
    filename: `${toKebabCase(animation.name)}.js`,
    language: 'javascript',
  }
}

/**
 * Extract initialization code from animation
 */
function extractInitCode(animation: Animation): string {
  const initString = animation.init.toString()
  // Extract the function body (everything between { and })
  const match = initString.match(/\{([\s\S]*)\}/)
  if (!match) return '{}'

  const body = match[1].trim()
  // Return the state object that's being returned
  const returnMatch = body.match(/return\s+(\{[\s\S]*\})/)
  if (returnMatch) {
    return returnMatch[1]
  }

  // If no return statement, try to find the last object literal
  const objectMatch = body.match(/(\{[\s\S]*\})(?![\s\S]*\{)/)
  return objectMatch ? objectMatch[1] : '{}'
}

/**
 * Extract update code from animation
 */
function extractUpdateCode(animation: Animation): string {
  const updateString = animation.update.toString()
  const match = updateString.match(/\{([\s\S]*)\}/)
  if (!match) return ''

  const body = match[1].trim()
  // Remove state destructuring if present and adjust references
  return body.replace(/const\s+\{[^}]+\}\s*=\s*state;?\s*/g, '')
}

/**
 * Extract render code from animation
 */
function extractRenderCode(animation: Animation): string {
  const renderString = animation.render.toString()
  const match = renderString.match(/\{([\s\S]*)\}/)
  if (!match) return ''

  const body = match[1].trim()
  // Remove state destructuring if present
  return body.replace(/const\s+\{[^}]+\}\s*=\s*state;?\s*/g, '')
}

/**
 * Convert parameters to JSON string
 */
function stringifyParameters(params: Record<string, unknown>): string {
  return JSON.stringify(params, null, 2)
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase())
}
