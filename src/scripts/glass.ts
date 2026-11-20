/**
 * Fondos WebGL propios, inspirados en los efectos "Fluted Glass" y "Topo Lines"
 * de la galería de AIDesigner, reescritos desde cero con la paleta del sitio.
 *
 * - glass: un campo de luz (ruido con deformación de dominio) se dibuja a baja
 *   resolución y se mira a través de vidrio acanalado: cada estría refleja y
 *   comprime la luz, con dispersión cromática en los bordes. El cursor mueve un
 *   núcleo dorado.
 * - topo: curvas de nivel de una cordillera generada con ruido. El cursor
 *   levanta un cerro bajo el puntero.
 *
 * Rendimiento: el campo de luz se calcula a 1/4 de resolución, el lienzo se
 * pausa fuera de pantalla o con la pestaña oculta, y con prefers-reduced-motion
 * se dibuja un solo cuadro. Si no hay WebGL queda el degradado CSS de fondo.
 */

type Mode = 'glass' | 'topo';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float s=0.0; float a=0.5;
  for(int i=0;i<4;i++){ s+=a*snoise(p); p=p*2.03+vec2(17.1,9.2); a*=0.5; }
  return s*0.5+0.5;
}
`;

const VERT = /* glsl */ `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FIELD = /* glsl */ `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uGold;
${NOISE}
float soft(vec2 p){
  float s = 0.0; float a = 0.55;
  for(int i=0;i<3;i++){ s += a*snoise(p); p = p*1.9 + vec2(11.3, 4.7); a *= 0.42; }
  return s*0.5 + 0.5;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 0.8;
  float t = uTime * 0.03;
  vec2 q = vec2(soft(p + vec2(0.0, t)), soft(p + vec2(5.2, 1.3) - t));
  float f = soft(p + 1.3*q + vec2(1.7 + 0.5*t, 9.2 - 0.3*t));
  float n = smoothstep(0.32, 0.72, f);
  // Luz principal arriba a la derecha y un reflejo frío abajo a la izquierda.
  vec2 kp = p - vec2(0.38, 0.22);
  float key = exp(-dot(kp, kp) * 2.4);
  vec2 rp = p - vec2(-0.55, -0.32);
  float rim = exp(-dot(rp, rp) * 4.0);
  // Segunda luz, violeta, que deriva despacio por la parte baja.
  vec2 vp = p - vec2(0.1 + 0.25 * sin(t * 3.0), -0.42);
  float vio = exp(-dot(vp, vp) * 3.2);
  vec3 night = vec3(0.027, 0.051, 0.149);
  vec3 deep  = vec3(0.075, 0.090, 0.330);
  vec3 cobalt= vec3(0.200, 0.330, 1.0);
  vec3 peri  = vec3(0.700, 0.760, 1.0);
  vec3 magenta = vec3(1.0, 0.30, 0.64);
  vec3 violet  = vec3(0.56, 0.36, 1.0);
  vec3 mint    = vec3(0.20, 0.92, 0.74);
  vec3 col = mix(night, deep, n * 0.9 + key * 0.3);
  col = mix(col, cobalt, clamp(n * key * 1.3, 0.0, 0.82));
  col = mix(col, peri, clamp((n - 0.64) * 1.7 * key, 0.0, 0.4));
  col += magenta * rim * 0.42 * (0.45 + n);
  col += violet * vio * 0.38 * (0.4 + n);
  col += mint * clamp((q.x - 0.62) * 2.2, 0.0, 1.0) * key * 0.22;
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 0.8;
  float d = length(p - m);
  col += vec3(0.96, 0.72, 0.24) * exp(-d*d*9.0) * 0.5 * uGold;
  col += vec3(0.30, 0.42, 1.0) * exp(-d*d*3.0) * 0.10;
  gl_FragColor = vec4(col, 1.0);
}`;

const FLUTES = /* glsl */ `
precision highp float;
uniform sampler2D uField; uniform vec2 uRes; uniform float uRibs; uniform float uTime; uniform float uScroll;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float ribs = uRibs * (1.0 - uScroll * 0.55);
  float x = uv.x * ribs;
  float id = floor(x);
  float u = fract(x) * 2.0 - 1.0;
  float lens = -u * 0.9;
  vec2 base = vec2((id + 0.5 + lens) / ribs, uv.y + u*u*0.018);
  float disp = 0.010 * u;
  vec3 col;
  col.r = texture2D(uField, base + vec2(disp, 0.0)).r;
  col.g = texture2D(uField, base).g;
  col.b = texture2D(uField, base - vec2(disp, 0.0)).b;
  float edge = pow(1.0 - abs(u), 0.32);
  col *= mix(0.62, 1.06, edge);
  float spec = smoothstep(0.35, 0.8, u) * (1.0 - smoothstep(0.8, 1.0, u));
  col += spec * 0.10 * vec3(0.78, 0.84, 1.0);
  col += smoothstep(0.955, 1.0, abs(u)) * 0.06;
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.045;
  vec2 v = uv - vec2(0.5, 0.55);
  col *= 1.0 - dot(v, v) * 0.75;
  gl_FragColor = vec4(col, 1.0);
}`;

const TOPO = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHover;
${NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.2;
  float t = uTime * 0.02;
  // Cordillera: crestas en diagonal y ruido de detalle.
  float ridge = 1.0 - abs(snoise(p * 0.55 + vec2(t, -t * 0.5)));
  float h = 0.55 * ridge * ridge + 0.45 * fbm(p * 0.9 + vec2(-t * 0.6, t));
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 2.2;
  float d = length(p - m);
  h += 0.35 * exp(-d * d * 3.0) * uHover;
  float levels = 18.0;
  float v = h * levels;
  float w = fwidth(v);
  float f1 = fract(v);
  float line = 1.0 - smoothstep(0.0, 1.2 * w, min(f1, 1.0 - f1));
  float f5 = fract(v / 5.0);
  float major = 1.0 - smoothstep(0.0, 1.8 * w, min(f5, 1.0 - f5) * 5.0);
  vec3 base = vec3(0.027, 0.051, 0.149);
  vec3 lineCol = mix(mix(vec3(0.42, 0.50, 0.95), vec3(1.0, 0.45, 0.30), smoothstep(0.35, 0.7, h)), vec3(0.96, 0.72, 0.24), smoothstep(0.7, 0.95, h));
  vec3 col = base + lineCol * (line * 0.33 + major * 0.35) * (0.35 + 0.65 * h);
  col += vec3(0.96, 0.72, 0.24) * exp(-d * d * 2.5) * 0.12 * uHover;
  float fade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.7, uv.y);
  col = mix(base, col, 0.35 + 0.65 * fade);
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('No se pudo crear el shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? 'Error al compilar el shader');
  }
  return shader;
}

function program(gl: WebGLRenderingContext, fragment: string): WebGLProgram {
  const p = gl.createProgram();
  if (!p) throw new Error('No se pudo crear el programa');
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'Error al enlazar');
  return p;
}

export interface Surface {
  /** 0 a 1: avance del scroll dentro de la sección (estrías más anchas). */
  setScroll(value: number): void;
}

class GlassSurface implements Surface {
  private readonly gl: WebGLRenderingContext;
  private readonly mode: Mode;
  /** Un solo cuadro, sin bucle: movimiento reducido o WebGL por software. */
  private readonly still: boolean;
  private readonly software: boolean;
  private readonly small: boolean;
  private fieldProgram?: WebGLProgram;
  private mainProgram?: WebGLProgram;
  private fbo?: WebGLFramebuffer;
  private fieldTex?: WebGLTexture;
  private fieldSize = [1, 1];
  private width = 1;
  private height = 1;
  private frame = 0;
  private visible = false;
  private start = performance.now();
  private last = 0;
  private scroll = 0;
  private mouse = { x: 0.72, y: 0.62 };
  private target = { x: 0.72, y: 0.62 };
  private hover = 0;
  private hoverTarget = 0;
  private readonly uniforms = new Map<string, WebGLUniformLocation | null>();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    mode: Mode,
  ) {
    // Si el navegador solo puede dibujar WebGL por software (sin GPU), una
    // animación a pantalla completa bloquearía el hilo principal: en ese caso
    // se pinta un único cuadro, más pequeño, cuando el navegador está libre.
    const attributes: WebGLContextAttributes = { antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl', { ...attributes, failIfMajorPerformanceCaveat: true });
    let software = !gl;
    gl ??= canvas.getContext('webgl', attributes);
    if (!gl) throw new Error('WebGL no disponible');
    // Algunos navegadores no marcan el renderizado por software como "caveat":
    // se reconoce por el nombre del renderizador (SwiftShader, llvmpipe...).
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) software = true;
    this.software = software;
    this.gl = gl;
    this.mode = mode;
    this.still = this.software || matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.small = matchMedia('(max-width: 47.99rem)').matches;

    if (mode === 'topo' && !gl.getExtension('OES_standard_derivatives')) throw new Error('Sin derivadas');

    if (this.still) {
      // Compilar y pintar un solo cuadro cuando el lienzo se acerque a la
      // pantalla y el navegador quede libre; otro si cambia el tamaño. Si algo
      // falla, queda el degradado CSS de la sección.
      let painted = false;
      const paint = () => {
        if (painted) return;
        painted = true;
        try {
          this.build();
          this.resize();
          canvas.classList.add('is-ready');
        } catch {
          canvas.remove();
        }
      };
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
      new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          if (idle) idle(paint, { timeout: 2500 });
          else setTimeout(paint, 300);
        },
        { rootMargin: '300px 0px' },
      ).observe(canvas);
      let pending = 0;
      new ResizeObserver(() => {
        clearTimeout(pending);
        pending = window.setTimeout(() => {
          if (painted) this.resize();
        }, 200);
      }).observe(canvas);
      return;
    }

    this.build();
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.resize();

    const host = canvas.closest<HTMLElement>('[data-glass-host]') ?? canvas.parentElement;
    if (host && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      host.addEventListener('pointermove', (event) => {
        const rect = canvas.getBoundingClientRect();
        this.target = { x: (event.clientX - rect.left) / rect.width, y: 1 - (event.clientY - rect.top) / rect.height };
        this.hoverTarget = 1;
      });
      host.addEventListener('pointerleave', () => {
        this.hoverTarget = 0;
        this.target = { x: 0.72, y: 0.62 };
      });
    }

    new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? false;
      this.toggle();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => this.toggle());
  }

  /** Geometría (un triángulo que cubre la pantalla) y programas. */
  private build(): void {
    const { gl } = this;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    if (this.mode === 'glass') {
      this.fieldProgram = program(gl, FIELD);
      this.mainProgram = program(gl, FLUTES);
    } else {
      this.mainProgram = program(gl, TOPO);
    }
  }

  setScroll(value: number): void {
    // Con un solo cuadro no se vuelve a pintar al hacer scroll.
    if (this.still) return;
    this.scroll = Math.min(1, Math.max(0, value));
  }

  private uniform(p: WebGLProgram, name: string): WebGLUniformLocation | null {
    const key = `${this.mode}:${p === this.fieldProgram ? 'f' : 'm'}:${name}`;
    if (!this.uniforms.has(key)) this.uniforms.set(key, this.gl.getUniformLocation(p, name));
    return this.uniforms.get(key) ?? null;
  }

  private toggle(): void {
    const run = this.visible && !document.hidden;
    if (run && !this.frame) {
      this.last = 0;
      this.frame = requestAnimationFrame(this.tick);
    } else if (!run && this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private resize(): void {
    const { gl } = this;
    const rect = this.canvas.getBoundingClientRect();
    const ratio = this.software ? 0.6 : Math.min(devicePixelRatio || 1, this.small ? 1.25 : 1.5);
    this.width = Math.max(1, Math.round(rect.width * ratio));
    this.height = Math.max(1, Math.round(rect.height * ratio));
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.mode === 'glass') {
      const fw = Math.max(64, Math.round(this.width / 4));
      const fh = Math.max(64, Math.round(this.height / 4));
      this.fieldSize = [fw, fh];
      if (this.fieldTex) gl.deleteTexture(this.fieldTex);
      if (this.fbo) gl.deleteFramebuffer(this.fbo);
      this.fieldTex = gl.createTexture() ?? undefined;
      gl.bindTexture(gl.TEXTURE_2D, this.fieldTex ?? null);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fw, fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.fbo = gl.createFramebuffer() ?? undefined;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo ?? null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fieldTex ?? null, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    if (this.still) this.render(8);
    else if (!this.frame) this.render((performance.now() - this.start) / 1000 + 8);
  }

  private readonly tick = (now: number): void => {
    this.frame = requestAnimationFrame(this.tick);
    const step = this.small ? 1000 / 30 : 1000 / 60;
    if (this.last && now - this.last < step - 1) return;
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0.016;
    this.last = now;
    const k = 1 - Math.pow(0.0015, dt);
    this.mouse.x += (this.target.x - this.mouse.x) * k;
    this.mouse.y += (this.target.y - this.mouse.y) * k;
    this.hover += (this.hoverTarget - this.hover) * k;
    this.render((now - this.start) / 1000 + 8);
    if (!this.canvas.classList.contains('is-ready')) this.canvas.classList.add('is-ready');
  };

  private render(time: number): void {
    const { gl } = this;
    if (!this.mainProgram) return;
    if (this.mode === 'glass' && this.fieldProgram && this.fbo) {
      const [fw, fh] = this.fieldSize;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.viewport(0, 0, fw ?? 1, fh ?? 1);
      gl.useProgram(this.fieldProgram);
      gl.uniform2f(this.uniform(this.fieldProgram, 'uRes'), fw ?? 1, fh ?? 1);
      gl.uniform1f(this.uniform(this.fieldProgram, 'uTime'), time);
      gl.uniform2f(this.uniform(this.fieldProgram, 'uMouse'), this.mouse.x, this.mouse.y);
      gl.uniform1f(this.uniform(this.fieldProgram, 'uGold'), 0.55 + 0.45 * this.hover);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.viewport(0, 0, this.width, this.height);
      gl.useProgram(this.mainProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fieldTex ?? null);
      gl.uniform1i(this.uniform(this.mainProgram, 'uField'), 0);
      gl.uniform2f(this.uniform(this.mainProgram, 'uRes'), this.width, this.height);
      gl.uniform1f(this.uniform(this.mainProgram, 'uRibs'), this.small ? 7 : 16);
      gl.uniform1f(this.uniform(this.mainProgram, 'uTime'), time);
      gl.uniform1f(this.uniform(this.mainProgram, 'uScroll'), this.scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    gl.viewport(0, 0, this.width, this.height);
    gl.useProgram(this.mainProgram);
    gl.uniform2f(this.uniform(this.mainProgram, 'uRes'), this.width, this.height);
    gl.uniform1f(this.uniform(this.mainProgram, 'uTime'), time);
    gl.uniform2f(this.uniform(this.mainProgram, 'uMouse'), this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uniform(this.mainProgram, 'uHover'), this.hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

/** Inicia todos los lienzos <canvas data-glass="glass|topo">. */
/**
 * Crea cada superficie cuando su lienzo se acerca a la pantalla: el contexto
 * WebGL del contacto o de Yupachayña no se abre hasta que hace falta.
 */
export function initSurfaces(): Map<HTMLCanvasElement, Surface> {
  const surfaces = new Map<HTMLCanvasElement, Surface>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const canvas = entry.target as HTMLCanvasElement;
        observer.unobserve(canvas);
        try {
          const mode = (canvas.dataset.glass as Mode) || 'glass';
          surfaces.set(canvas, new GlassSurface(canvas, mode));
        } catch {
          // Sin WebGL queda el degradado CSS de la sección.
        }
      }
    },
    { rootMargin: '600px 0px' },
  );
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>('canvas[data-glass]')) observer.observe(canvas);
  return surfaces;
}
