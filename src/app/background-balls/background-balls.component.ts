
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

interface Ball {
  x: number;
  y: number;
  r: number;
  angle: number;
  speed: number;
  phase: number;
  color: number;
  vx: number;
  vy: number;
}

@Component({
  selector: 'app-background-balls',
  standalone: true,
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      display: block;
      pointer-events: none;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `]
})
export class BackgroundBallsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() startBelow = '';

  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private ctx!: CanvasRenderingContext2D;
  private balls: Ball[] = [];
  private stripEl: Element | null = null;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private raf = 0;
  private lastFrame = 0;
  private speedK = 1;

  private mouse = {
    x: -9999,
    y: -9999
  };

  private readonly palette = [
    '#CDBAF6',
    '#F2BCD2',
    '#B8E4D2',
    '#F7C9B4',
    '#B9D2F7',
    '#F0D98E',
    '#B7DDE3'
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const context = this.canvasRef.nativeElement.getContext('2d');

    if (!context) {
      return;
    }

    this.ctx = context;

    this.speedK = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches ? 0 : 1;

    this.resize();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerout', this.onPointerOut);

    this.zone.runOutsideAngular(() => {
      this.raf = requestAnimationFrame(this.loop);
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    cancelAnimationFrame(this.raf);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerout', this.onPointerOut);
  }

  private readonly onResize = (): void => {
    this.resize();
  };

  private readonly onMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      return;
    }

    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  };

  private readonly onPointerOut = (event: PointerEvent): void => {
    if (!event.relatedTarget) {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    }
  };

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;

    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(this.W * this.dpr);
    canvas.height = Math.round(this.H * this.dpr);

    this.ctx.setTransform(
      this.dpr,
      0,
      0,
      this.dpr,
      0,
      0
    );

    if (!this.balls.length) {
      this.createBalls();
    } else {
      this.balls.forEach(ball => this.keepInside(ball));
    }
  }

  private createBalls(): void {
    this.balls = [];

    const total = Math.max(
      4,
      Math.min(6, Math.round((this.W * this.H) / 260000))
    );

    const scale = Math.min(
      1,
      Math.max(0.72, this.W / 1360)
    );

    for (let i = 0; i < total; i++) {
      const large = i < 4;

      const r = (
        large
          ? 165 + Math.random() * 95
          : 90 + Math.random() * 55
      ) * scale;

      const marginX = Math.min(this.W / 2, r * 0.6);
      const marginY = Math.min(this.H / 2, r * 0.6);

      this.balls.push({
        x: marginX + Math.random() * Math.max(
          0,
          this.W - marginX * 2
        ),
        y: marginY + Math.random() * Math.max(
          0,
          this.H - marginY * 2
        ),
        r,
        angle: Math.random() * Math.PI * 2,
        speed: 0.10 + Math.random() * 0.14,
        phase: Math.random() * 100,
        color: i % this.palette.length,
        vx: 0,
        vy: 0
      });
    }
  }

  private keepInside(ball: Ball): void {
    const marginX = Math.min(this.W / 2, ball.r * 0.6);
    const marginY = Math.min(this.H / 2, ball.r * 0.6);

    if (ball.x < marginX) {
      ball.x = marginX;
      ball.vx = Math.abs(ball.vx) * 0.7;
      ball.angle = Math.PI - ball.angle;
    }

    if (ball.x > this.W - marginX) {
      ball.x = this.W - marginX;
      ball.vx = -Math.abs(ball.vx) * 0.7;
      ball.angle = Math.PI - ball.angle;
    }

    if (ball.y < marginY) {
      ball.y = marginY;
      ball.vy = Math.abs(ball.vy) * 0.7;
      ball.angle = -ball.angle;
    }

    if (ball.y > this.H - marginY) {
      ball.y = this.H - marginY;
      ball.vy = -Math.abs(ball.vy) * 0.7;
      ball.angle = -ball.angle;
    }
  }

  private moveBall(ball: Ball, dt: number): void {
    if (this.speedK === 0) {
      return;
    }

    ball.phase += 0.0045 * dt;
    ball.angle += Math.sin(ball.phase) * 0.004 * dt;

    ball.vx += Math.cos(ball.angle) * ball.speed * 0.038 * dt;
    ball.vy += Math.sin(ball.angle) * ball.speed * 0.038 * dt;

    const dx = ball.x - this.mouse.x;
    const dy = ball.y - this.mouse.y;
    const distance = Math.hypot(dx, dy);
    const influenceRadius = ball.r + 160;

    if (distance > 1 && distance < influenceRadius) {
      const proximity = 1 - distance / influenceRadius;
      const force = proximity * proximity * 0.25 * dt;

      ball.vx += (dx / distance) * force;
      ball.vy += (dy / distance) * force;
    }

    const damping = Math.pow(0.975, dt);

    ball.vx *= damping;
    ball.vy *= damping;

    const maxSpeed = 1.65;
    const currentSpeed = Math.hypot(ball.vx, ball.vy);

    if (currentSpeed > maxSpeed) {
      ball.vx *= maxSpeed / currentSpeed;
      ball.vy *= maxSpeed / currentSpeed;
    }

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    this.keepInside(ball);
  }

  private isDark(): boolean {
    return document.documentElement.getAttribute(
      'data-theme'
    ) === 'dark';
  }

  private getRevealPosition(): number {
    if (!this.startBelow) {
      return -180;
    }

    if (!this.stripEl || !this.stripEl.isConnected) {
      this.stripEl = document.querySelector(this.startBelow);
    }

    if (!this.stripEl) {
      return this.H;
    }

    return this.stripEl.getBoundingClientRect().bottom;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const value = hex.replace('#', '');

    const full = value.length === 3
      ? value.split('').map(
          character => character + character
        ).join('')
      : value;

    const number = parseInt(full, 16);

    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private draw(): void {
    const ctx = this.ctx;
    const W = this.W;
    const H = this.H;
    const dark = this.isDark();
    const revealPosition = this.getRevealPosition();

    ctx.clearRect(0, 0, W, H);

    if (revealPosition >= H) {
      return;
    }

    ctx.save();

    for (const ball of this.balls) {
      const color = this.palette[ball.color];

      const gradient = ctx.createRadialGradient(
        ball.x - ball.r * 0.22,
        ball.y - ball.r * 0.22,
        ball.r * 0.12,
        ball.x,
        ball.y,
        ball.r
      );

      if (dark) {
        gradient.addColorStop(
          0,
          this.hexToRgba(color, 0.28)
        );

        gradient.addColorStop(
          0.24,
          this.hexToRgba(color, 0.25)
        );

        gradient.addColorStop(
          0.6,
          this.hexToRgba(color, 0.15)
        );

        gradient.addColorStop(
          1,
          this.hexToRgba(color, 0)
        );

        ctx.globalAlpha = 0.88;
      } else {
        gradient.addColorStop(
          0,
          this.hexToRgba(color, 0.80)
        );

        gradient.addColorStop(
          0.2,
          this.hexToRgba(color, 0.76)
        );

        gradient.addColorStop(
          0.56,
          this.hexToRgba(color, 0.51)
        );

        gradient.addColorStop(
          1,
          this.hexToRgba(color, 0)
        );

        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    const transitionSize = 170;

    if (revealPosition > -transitionSize) {
      ctx.save();

      ctx.globalCompositeOperation = 'destination-in';

      const mask = ctx.createLinearGradient(
        0,
        revealPosition,
        0,
        revealPosition + transitionSize
      );

      mask.addColorStop(0, 'rgba(0, 0, 0, 0)');
      mask.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = mask;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  private readonly loop = (time: number): void => {
    const dt = this.lastFrame
      ? Math.min(2, (time - this.lastFrame) / 16.6667)
      : 1;

    this.lastFrame = time;

    if (!document.hidden) {
      this.balls.forEach(ball => this.moveBall(ball, dt));
      this.draw();
    }

    this.raf = requestAnimationFrame(this.loop);
  };
}
