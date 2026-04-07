/**
 * Motor de Física 2D para Prova 3 — Travessia da Ponte
 * Implementação completa com plataformas dinâmicas, coyote time, trail de luz
 */

export interface PhysicsConfig {
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
  friction: number;
  maxFallSpeed: number;
  playerRadius: number;
  coyoteTime: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  coyoteFrames: number;
  isDead: boolean;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'stable' | 'unstable' | 'ghost' | 'moving' | 'fake';
  // Unstable
  shakeTimer?: number;
  fallTimer?: number;
  falling?: boolean;
  fallVelocity?: number;
  // Ghost
  visible?: boolean;
  cycleTimer?: number;
  cycleDuration?: number;
  visibleDuration?: number;
  // Moving
  originX?: number;
  originY?: number;
  moveAxis?: 'x' | 'y';
  moveAmplitude?: number;
  moveSpeed?: number;
  moveTimer?: number;
}

const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: 0.6,
  jumpForce: -12,
  moveSpeed: 4,
  friction: 0.85,
  maxFallSpeed: 15,
  playerRadius: 8,
  coyoteTime: 6,
};

// RNG Mulberry32 determinístico
class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export class BridgePhysics {
  private config: PhysicsConfig;
  private player: Player;
  private platforms: Platform[];
  private deathY: number;
  private rng: SeededRNG;

  constructor(config: Partial<PhysicsConfig> = {}, seed: number = Math.random() * 1000000) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rng = new SeededRNG(Math.floor(seed));

    this.player = {
      x: 50,
      y: 300,
      vx: 0,
      vy: 0,
      isGrounded: false,
      coyoteFrames: 0,
      isDead: false,
      trail: [],
    };

    this.platforms = [];
    this.deathY = 600;
  }

  update(input: { left: boolean; right: boolean; jump: boolean }): void {
    if (this.player.isDead) return;

    // Movimento horizontal
    let targetVx = 0;
    if (input.left) targetVx -= this.config.moveSpeed;
    if (input.right) targetVx += this.config.moveSpeed;

    this.player.vx += (targetVx - this.player.vx) * (1 - this.config.friction);

    // Pulo com coyote time
    if (input.jump && (this.player.isGrounded || this.player.coyoteFrames > 0)) {
      this.player.vy = this.config.jumpForce;
      this.player.isGrounded = false;
      this.player.coyoteFrames = 0;
    }

    // Aplicar gravidade
    if (!this.player.isGrounded) {
      this.player.vy += this.config.gravity;
      this.player.vy = Math.min(this.player.vy, this.config.maxFallSpeed);
    }

    // Atualizar posição
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Verficar colisões
    this.checkCollisions();

    // Atualizar plataformas especiais
    this.updatePlatforms();

    // Atualizar trail
    this.updateTrail();

    // Verficar morte
    this.checkDeath();

    // Decrementar coyote frames se no ar
    if (!this.player.isGrounded && this.player.coyoteFrames > 0) {
      this.player.coyoteFrames--;
    }
  }

  private checkCollisions(): void {
    this.player.isGrounded = false;

    for (const platform of this.platforms) {
      // Skip plataformas fantasma invisíveis e fake
      if (platform.type === 'ghost' && !platform.visible) continue;
      if (platform.type === 'fake') continue;

      // AABB collision com resolução por cima
      const playerLeft = this.player.x - this.config.playerRadius;
      const playerRight = this.player.x + this.config.playerRadius;
      const playerTop = this.player.y - this.config.playerRadius;
      const playerBottom = this.player.y + this.config.playerRadius;

      const platformLeft = platform.x;
      const platformRight = platform.x + platform.width;
      const platformTop = platform.y;
      const platformBottom = platform.y + platform.height;

      // Verificar interseção
      if (
        playerRight > platformLeft &&
        playerLeft < platformRight &&
        playerBottom > platformTop &&
        playerTop < platformBottom
      ) {
        // Resolução por cima — o jogador estaba acima antes
        if (this.player.vy >= 0) {
          this.player.y = platformTop - this.config.playerRadius;
          this.player.vy = 0;
          this.player.isGrounded = true;
          this.player.coyoteFrames = this.config.coyoteTime;

          // Herdar velocidade de plataformas móveis
          if (platform.type === 'moving' && platform.moveAxis === 'x') {
            const offset = Math.sin((platform.moveTimer || 0) * 0.05) * (platform.moveAmplitude || 0);
            this.player.vx += offset * 0.01;
          }

          // Marca plataforma instável como pisada
          if (platform.type === 'unstable' && !platform.shakeTimer) {
            platform.shakeTimer = 0;
          }
        }
      }
    }
  }

  private updatePlatforms(): void {
    for (const platform of this.platforms) {
      if (platform.type === 'unstable' && platform.shakeTimer !== undefined) {
        platform.shakeTimer++;
        // Tremor por 1.5s (90 frames a 60fps)
        if (platform.shakeTimer > 90) {
          platform.falling = true;
          platform.fallVelocity = 0;
        }
      }

      if (platform.type === 'unstable' && platform.falling) {
        platform.fallVelocity = (platform.fallVelocity || 0) + this.config.gravity;
        platform.y += platform.fallVelocity;
      }

      // Ghost platform cycling
      if (platform.type === 'ghost') {
        platform.cycleTimer = (platform.cycleTimer || 0) + 1;
        const cycleDuration = platform.cycleDuration || 180;
        const visibleDuration = platform.visibleDuration || 90;

        const posInCycle = platform.cycleTimer % cycleDuration;
        platform.visible = posInCycle < visibleDuration;
      }

      // Moving platforms
      if (platform.type === 'moving') {
        platform.moveTimer = (platform.moveTimer || 0) + 1;
        const offset = Math.sin(platform.moveTimer * 0.05) * (platform.moveAmplitude || 20);

        if (platform.moveAxis === 'x') {
          platform.x = (platform.originX || platform.x) + offset;
        } else if (platform.moveAxis === 'y') {
          platform.y = (platform.originY || platform.y) + offset;
        }
      }
    }
  }

  private updateTrail(): void {
    // Adicionar posição atual ao trail
    this.player.trail.push({
      x: this.player.x,
      y: this.player.y,
      alpha: 1,
    });

    // Manter apenas 15 posições, decair alpha
    while (this.player.trail.length > 15) {
      this.player.trail.shift();
    }

    // Atualizar alpha
    this.player.trail.forEach((point, idx) => {
      point.alpha = 1 - (idx / this.player.trail.length) * 0.93; // Decay
    });
  }

  private checkDeath(): void {
    if (this.player.y > this.deathY) {
      this.player.isDead = true;
    }
  }

  respawn(x: number, y: number): void {
    this.player.x = x;
    this.player.y = y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isDead = false;
    this.player.trail = [];
  }

  getPlayerState(): Player {
    return { ...this.player };
  }

  getPlatformStates(): Platform[] {
    return this.platforms.map((p) => ({ ...p }));
  }

  setPlatforms(platforms: Platform[]): void {
    this.platforms = platforms;
  }

  addPlatform(platform: Platform): void {
    this.platforms.push(platform);
  }

  // Gerador de nível determinístico
  static generateLevel(
    seed: number,
    difficulty: 'easy' | 'medium' | 'hard',
    width: number = 800,
    height: number = 500
  ): Platform[] {
    const rng = new SeededRNG(seed);

    const difficultyConfig = {
      easy: { count: 15, stable: 0.7, moving: 0.15, unstable: 0.1, ghost: 0.05, fake: 0 },
      medium: { count: 25, stable: 0.45, moving: 0.15, unstable: 0.15, ghost: 0.15, fake: 0.1 },
      hard: { count: 35, stable: 0.3, moving: 0.15, unstable: 0.2, ghost: 0.2, fake: 0.15 },
    };

    const config = difficultyConfig[difficulty];
    const platforms: Platform[] = [];

    // Plataforma inicial
    platforms.push({
      x: 0,
      y: height - 100,
      width: 100,
      height: 20,
      type: 'stable',
    });

    // Gerar plataformas intermediárias
    let currentX = 100;
    let currentY = height - 100;

    for (let i = 0; i < config.count; i++) {
      const typeRoll = rng.next();
      let type: Platform['type'] = 'stable';

      if (typeRoll < config.stable) type = 'stable';
      else if (typeRoll < config.stable + config.moving) type = 'moving';
      else if (typeRoll < config.stable + config.moving + config.unstable) type = 'unstable';
      else if (typeRoll < config.stable + config.moving + config.unstable + config.ghost) type = 'ghost';
      else type = 'fake';

      const platformWidth = 40 + rng.next() * 40;
      const horizontalGap = 30 + rng.next() * 60; // Variação no espaçamento
      const verticalGap = -40 + rng.next() * 80; // Pode subir ou descer

      currentX += horizontalGap;
      currentY += verticalGap;

      // Clampar para fora dos limites
      currentY = Math.max(50, Math.min(height - 150, currentY));
      currentX = Math.max(50, Math.min(width - platformWidth, currentX));

      const platform: Platform = {
        x: currentX,
        y: currentY,
        width: platformWidth,
        height: 15,
        type,
      };

      if (type === 'moving') {
        platform.originX = currentX;
        platform.originY = currentY;
        platform.moveAxis = rng.next() > 0.5 ? 'x' : 'y';
        platform.moveAmplitude = 20 + rng.next() * 30;
        platform.moveSpeed = 0.05;
        platform.moveTimer = 0;
      }

      if (type === 'ghost') {
        platform.visible = true;
        platform.cycleTimer = 0;
        platform.cycleDuration = 160 + rng.next() * 80;
        platform.visibleDuration = (platform.cycleDuration || 180) * 0.5;
      }

      platforms.push(platform);
    }

    // Plataforma final
    platforms.push({
      x: width - 100,
      y: 50,
      width: 100,
      height: 20,
      type: 'stable',
    });

    return platforms;
  }
}
