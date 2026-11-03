
import '@fontsource-variable/figtree';
import '@fontsource-variable/bricolage-grotesque';

import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { BackgroundBallsComponent } from './background-balls/background-balls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BackgroundBallsComponent],
  templateUrl: './app.component.html'
})
export class App implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private themeButton?: HTMLButtonElement;
  private menuButton?: HTMLButtonElement;
  private menuLinks?: HTMLElement;

  private emailButton?: HTMLButtonElement;
  private emailDialog?: HTMLElement;
  private emailCloseButton?: HTMLButtonElement;
  private copyEmailButton?: HTMLButtonElement;
  private previousFocus?: HTMLElement;

  private marqueeTrack?: HTMLElement;
  private marqueeAnimation?: Animation;
  private marqueeResizeObserver?: ResizeObserver;
  private marqueeMotionPreference?: MediaQueryList;
  private originalMarqueeCount = 0;

  private readonly email = 'giovannacarolina052@gmail.com';

  private readonly sectionIds = [
    'sobre',
    'tecnologias',
    'experiencia',
    'projetos',
    'certificacoes',
    'contato'
  ];

  private readonly technologies = [
    {
      title: 'Front-End',
      description: 'Tecnologias para construir interfaces responsivas.',
      items: [
        ['HTML5 semântico', '5', '#E86F3E'],
        ['CSS3', '3', '#4F86D9'],
        ['Flexbox', 'Fx', '#8B6FD1'],
        ['CSS Grid', 'Gr', '#3DA68A'],
        ['Media Queries', 'MQ', '#D9609A'],
        ['Variáveis CSS', '--', '#B58A2E'],
        ['JavaScript', 'JS', '#C9A21B'],
        ['Bootstrap 5', 'B', '#7A4FC9'],
        ['Tailwind CSS', 'Tw', '#2FA8C4']
      ]
    },
    {
      title: 'Bibliotecas',
      description: 'Frameworks e bibliotecas utilizados em projetos.',
      items: [
        ['React', 'Re', '#3BA8C9'],
        ['Next.js', 'N', 'ink'],
        ['TypeScript', 'TS', '#3F77C4'],
        ['Leaflet.js', 'Lf', '#4FA36B'],
        ['Chart.js', 'Ch', '#E0709A']
      ]
    },
    {
      title: 'Dados e IA',
      description: 'Banco de dados e integração com inteligência artificial.',
      items: [
        ['PostgreSQL', 'Pg', '#4C77B5'],
        ['Gemini API', 'Ge', '#8A6FD1']
      ]
    },
    {
      title: 'Qualidade',
      description: 'Testes e acompanhamento do desenvolvimento.',
      items: [
        ['Testes manuais de QA', 'QA', '#3DA68A'],
        ['Trello', 'Tr', '#4F86D9']
      ]
    },
    {
      title: 'Ferramentas',
      description: 'Ferramentas de desenvolvimento e versionamento.',
      items: [
        ['Git', 'Gt', '#E0674A'],
        ['GitHub', 'Gh', 'ink'],
        ['GitHub Pages', 'Pg', '#7B5CC8'],
        ['VS Code', 'VS', '#3F77C4'],
        ['Live Server', 'Ls', '#D9609A']
      ]
    },
    {
      title: 'Estudando agora',
      description: 'Tecnologias e conhecimentos em desenvolvimento.',
      items: [
        ['Angular', 'Ng', '#D93054'],
        ['Node.js', 'No', '#4FA36B'],
        ['React avançado', 'Re', '#3BA8C9'],
        ['Git avançado', 'Gt', '#E0674A']
      ]
    }
  ];

  ngAfterViewInit(): void {
    this.initializeTheme();
    this.initializeNavigation();
    this.initializeMarquee();
    this.initializeTechnologies();
    this.initializeAnimations();
    this.initializeScroll();
    this.initializeEmailDialog();
  }

  private initializeTheme(): void {
    const button = document.getElementById('theme');

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    this.themeButton = button;

    let initialTheme = 'light';

    try {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'dark' || savedTheme === 'light') {
        initialTheme = savedTheme;
      }
    } catch {}

    document.documentElement.setAttribute(
      'data-theme',
      initialTheme
    );

    this.updateThemeButton();

    button.addEventListener('click', this.toggleTheme);
  }

  private readonly toggleTheme = (): void => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);

    this.updateThemeButton();

    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  private updateThemeButton(): void {
    if (!this.themeButton) {
      return;
    }

    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';

    this.themeButton.textContent = isDark ? '☀' : '☾';

    this.themeButton.setAttribute(
      'aria-label',
      isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
    );

    this.themeButton.setAttribute(
      'aria-pressed',
      String(isDark)
    );

    this.themeButton.title =
      isDark ? 'Modo claro' : 'Modo escuro';
  }

  private initializeNavigation(): void {
    const button = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    if (
      !(button instanceof HTMLButtonElement) ||
      !(links instanceof HTMLElement)
    ) {
      return;
    }

    this.menuButton = button;
    this.menuLinks = links;

    button.addEventListener('click', this.toggleMenu);

    links
      .querySelectorAll<HTMLAnchorElement>('a')
      .forEach(link => {
        link.addEventListener('click', this.closeMenu);
      });

    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeyboard);
    window.addEventListener('resize', this.handleResize);
  }

  private readonly toggleMenu = (): void => {
    const open =
      this.menuLinks?.classList.contains('open') ?? false;

    this.setMenuOpen(!open);
  };

  private readonly closeMenu = (): void => {
    this.setMenuOpen(false);
  };

  private setMenuOpen(open: boolean): void {
    if (!this.menuButton || !this.menuLinks) {
      return;
    }

    this.menuButton.classList.toggle('open', open);
    this.menuLinks.classList.toggle('open', open);

    this.menuButton.setAttribute(
      'aria-expanded',
      String(open)
    );

    this.menuButton.setAttribute(
      'aria-label',
      open ? 'Fechar menu' : 'Abrir menu'
    );
  }

  private readonly handleOutsideClick = (
    event: MouseEvent
  ): void => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (
      this.menuButton?.contains(target) ||
      this.menuLinks?.contains(target)
    ) {
      return;
    }

    this.closeMenu();
  };

  private readonly handleKeyboard = (
    event: KeyboardEvent
  ): void => {
    if (event.key === 'Escape') {
      if (this.emailDialog && !this.emailDialog.hidden) {
        this.closeEmailDialog();
      } else {
        this.closeMenu();
      }

      return;
    }

    if (
      event.key === 'Tab' &&
      this.emailDialog &&
      !this.emailDialog.hidden
    ) {
      this.trapDialogFocus(event);
    }
  };

  private readonly handleResize = (): void => {
    if (window.innerWidth > 900) {
      this.closeMenu();
    }
  };

  private initializeMarquee(): void {
    const track = document.getElementById('track');

    if (!(track instanceof HTMLElement)) {
      return;
    }

    this.marqueeTrack = track;

    const originalItems = Array.from(
      track.children
    ) as HTMLElement[];

    if (originalItems.length === 0) {
      return;
    }

    this.originalMarqueeCount = originalItems.length;

    track.style.animation = 'none';
    track.style.display = 'inline-flex';
    track.style.flexWrap = 'nowrap';
    track.style.gap = '0';
    track.style.width = 'max-content';

    const duplicateOriginals = (): void => {
      const fragment = document.createDocumentFragment();

      originalItems.forEach(item => {
        const clone = item.cloneNode(true) as HTMLElement;

        clone.setAttribute('aria-hidden', 'true');

        fragment.appendChild(clone);
      });

      track.appendChild(fragment);
    };

    duplicateOriginals();

    const first = track.children[0] as HTMLElement;
    const second = track.children[
      this.originalMarqueeCount
    ] as HTMLElement;

    const sequenceWidth =
      second.offsetLeft - first.offsetLeft;

    const viewportWidth =
      track.parentElement?.clientWidth ?? window.innerWidth;

    if (sequenceWidth > 0) {
      const repetitions = Math.max(
        3,
        Math.ceil(viewportWidth / sequenceWidth) + 3
      );

      for (let i = 2; i < repetitions; i++) {
        duplicateOriginals();
      }
    }

    this.marqueeMotionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    this.marqueeMotionPreference.addEventListener(
      'change',
      this.startMarquee
    );

    const container = track.parentElement;

    if (container && 'ResizeObserver' in window) {
      this.marqueeResizeObserver = new ResizeObserver(() => {
        this.startMarquee();
      });

      this.marqueeResizeObserver.observe(container);
    }

    this.startMarquee();

    void document.fonts.ready.then(() => {
      this.startMarquee();
    });
  }

  private readonly startMarquee = (): void => {
    const track = this.marqueeTrack;

    if (!track || this.originalMarqueeCount === 0) {
      return;
    }

    this.marqueeAnimation?.cancel();
    this.marqueeAnimation = undefined;

    track.style.animation = 'none';
    track.style.transform = 'translate3d(0, 0, 0)';

    if (this.marqueeMotionPreference?.matches) {
      return;
    }

    const first = track.children[0] as HTMLElement;

    const second = track.children[
      this.originalMarqueeCount
    ] as HTMLElement | undefined;

    if (!first || !second) {
      return;
    }

    const sequenceWidth =
      second.offsetLeft - first.offsetLeft;

    if (sequenceWidth <= 0) {
      return;
    }

    const viewportWidth =
      track.parentElement?.clientWidth ?? window.innerWidth;

    const requiredRepetitions = Math.max(
      3,
      Math.ceil(viewportWidth / sequenceWidth) + 3
    );

    const currentRepetitions = Math.floor(
      track.children.length / this.originalMarqueeCount
    );

    for (
      let repetition = currentRepetitions;
      repetition < requiredRepetitions;
      repetition++
    ) {
      const fragment = document.createDocumentFragment();

      for (
        let index = 0;
        index < this.originalMarqueeCount;
        index++
      ) {
        const original = track.children[index] as HTMLElement;
        const clone = original.cloneNode(true) as HTMLElement;

        clone.setAttribute('aria-hidden', 'true');

        fragment.appendChild(clone);
      }

      track.appendChild(fragment);
    }

    const pixelsPerSecond = 75;

    const duration = Math.max(
      4000,
      Math.round((sequenceWidth / pixelsPerSecond) * 1000)
    );

    this.marqueeAnimation = track.animate(
      [
        {
          transform: 'translate3d(0, 0, 0)'
        },
        {
          transform: `translate3d(-${sequenceWidth}px, 0, 0)`
        }
      ],
      {
        duration,
        iterations: Infinity,
        easing: 'linear',
        fill: 'both'
      }
    );
  };

  private initializeTechnologies(): void {
    const tabs = document.getElementById('tabs');
    const panel = document.getElementById('panel');

    if (!tabs || !panel) {
      return;
    }

    const buttons: HTMLButtonElement[] = [];

    const showCategory = (index: number): void => {
      const category = this.technologies[index];

      buttons.forEach((button, position) => {
        const selected = position === index;

        button.classList.toggle('on', selected);

        button.setAttribute(
          'aria-selected',
          String(selected)
        );

        button.tabIndex = selected ? 0 : -1;
      });

      panel.className =
        index === this.technologies.length - 1
          ? 'panel study'
          : 'panel';

      panel.setAttribute(
        'aria-labelledby',
        `tech-tab-${index}`
      );

      const title = document.createElement('h3');
      title.textContent = category.title;

      const description = document.createElement('p');
      description.textContent = category.description;

      const tiles = document.createElement('div');
      tiles.className = 'tiles';

      category.items.forEach((item, position) => {
        const [name, abbreviation, colorValue] = item;

        const color =
          colorValue === 'ink'
            ? 'var(--ink)'
            : colorValue;

        const tile = document.createElement('div');
        tile.className = 'tile';

        tile.style.animationDelay = `${position * 45}ms`;

        const symbol = document.createElement('i');
        symbol.textContent = abbreviation;

        symbol.style.background =
          `color-mix(in srgb, ${color} 16%, var(--surface))`;

        symbol.style.color = color;

        const label = document.createElement('span');
        label.textContent = name;

        tile.appendChild(symbol);
        tile.appendChild(label);

        tiles.appendChild(tile);
      });

      panel.replaceChildren(title, description, tiles);
    };

    this.technologies.forEach((category, index) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.id = `tech-tab-${index}`;

      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'panel');

      const label = document.createElement('span');
      label.textContent = category.title;

      const count = document.createElement('b');
      count.textContent = String(category.items.length);

      button.appendChild(label);
      button.appendChild(count);

      button.addEventListener('click', () => {
        showCategory(index);
      });

      button.addEventListener('keydown', event => {
        let nextIndex = index;

        if (
          event.key === 'ArrowRight' ||
          event.key === 'ArrowDown'
        ) {
          nextIndex = (index + 1) % buttons.length;
        } else if (
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowUp'
        ) {
          nextIndex =
            (index - 1 + buttons.length) % buttons.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = buttons.length - 1;
        } else {
          return;
        }

        event.preventDefault();

        showCategory(nextIndex);
        buttons[nextIndex]?.focus();
      });

      buttons.push(button);
      tabs.appendChild(button);
    });

    showCategory(0);
  }

  private initializeAnimations(): void {
    const elements = document.querySelectorAll<HTMLElement>(
      'section:not(.hero) h2, section:not(.hero) .sub, .rv'
    );

    document.documentElement.classList.add('js');

    elements.forEach((element, index) => {
      element.setAttribute('data-reveal', '');

      element.style.setProperty(
        '--reveal-delay',
        `${(index % 3) * 70}ms`
      );
    });

    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => {
        element.classList.add('in');
      });

      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('in');

          this.observer?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    elements.forEach(element => {
      this.observer?.observe(element);
    });
  }

  private initializeScroll(): void {
    window.addEventListener(
      'scroll',
      this.handleScroll,
      { passive: true }
    );

    this.handleScroll();
  }

  private readonly handleScroll = (): void => {
    this.updateProgress();
    this.updateActiveSection();
  };

  private updateProgress(): void {
    const progress = document.getElementById('prog');

    if (!progress) {
      return;
    }

    const html = document.documentElement;

    const maxScroll =
      html.scrollHeight - html.clientHeight;

    const percentage =
      maxScroll > 0
        ? (window.scrollY / maxScroll) * 100
        : 0;

    progress.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;
  }

  private updateActiveSection(): void {
    let currentSection = '';

    const offset = window.scrollY + 170;

    this.sectionIds.forEach(id => {
      const section = document.getElementById(id);

      if (section && section.offsetTop <= offset) {
        currentSection = id;
      }
    });

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 30
    ) {
      currentSection = 'contato';
    }

    document
      .querySelectorAll<HTMLAnchorElement>('.nav-links a')
      .forEach(link => {
        const active =
          link.getAttribute('href') ===
          `#${currentSection}`;

        link.classList.toggle('is-active', active);

        if (active) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
  }

  private initializeEmailDialog(): void {
    const button = document.getElementById('email-button');
    const dialog = document.getElementById('email-dialog');
    const closeButton = document.getElementById('email-close');
    const copyButton = document.getElementById('copy-email');

    if (
      !(button instanceof HTMLButtonElement) ||
      !(dialog instanceof HTMLElement) ||
      !(closeButton instanceof HTMLButtonElement) ||
      !(copyButton instanceof HTMLButtonElement)
    ) {
      return;
    }

    this.emailButton = button;
    this.emailDialog = dialog;
    this.emailCloseButton = closeButton;
    this.copyEmailButton = copyButton;

    button.addEventListener('click', this.openEmailDialog);
    closeButton.addEventListener('click', this.closeEmailDialog);
    copyButton.addEventListener('click', this.copyEmail);

    dialog.addEventListener('click', this.handleDialogClick);
  }

  private readonly openEmailDialog = (): void => {
    if (!this.emailDialog) {
      return;
    }

    this.previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;

    const feedback = document.getElementById('email-feedback');

    if (feedback) {
      feedback.textContent = '';
    }

    if (this.copyEmailButton) {
      this.copyEmailButton.textContent = 'Copiar';
    }

    this.emailDialog.hidden = false;

    document.body.classList.add('modal-open');

    this.emailCloseButton?.focus();
  };

  private readonly closeEmailDialog = (): void => {
    if (!this.emailDialog) {
      return;
    }

    this.emailDialog.hidden = true;

    document.body.classList.remove('modal-open');

    this.previousFocus?.focus();
  };

  private readonly handleDialogClick = (
    event: MouseEvent
  ): void => {
    if (event.target === this.emailDialog) {
      this.closeEmailDialog();
    }
  };

  private trapDialogFocus(event: KeyboardEvent): void {
    if (!this.emailDialog) {
      return;
    }

    const focusable =
      this.emailDialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    const elements = Array.from(focusable);

    if (elements.length === 0) {
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (!elements.includes(active as HTMLElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  private readonly copyEmail = async (): Promise<void> => {
    const feedback = document.getElementById('email-feedback');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.email);
      } else {
        const textarea = document.createElement('textarea');

        textarea.value = this.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);

        textarea.select();

        const copied = document.execCommand('copy');

        textarea.remove();

        if (!copied) {
          throw new Error('Não foi possível copiar.');
        }
      }

      if (this.copyEmailButton) {
        this.copyEmailButton.textContent = 'Copiado!';
      }

      if (feedback) {
        feedback.textContent = 'Endereço de e-mail copiado.';
      }
    } catch {
      if (feedback) {
        feedback.textContent =
          'Não foi possível copiar automaticamente. Selecione o endereço acima para copiar.';
      }
    }
  };

  ngOnDestroy(): void {
    this.observer?.disconnect();

    this.marqueeAnimation?.cancel();
    this.marqueeResizeObserver?.disconnect();

    this.marqueeMotionPreference?.removeEventListener(
      'change',
      this.startMarquee
    );

    this.themeButton?.removeEventListener(
      'click',
      this.toggleTheme
    );

    this.menuButton?.removeEventListener(
      'click',
      this.toggleMenu
    );

    this.menuLinks
      ?.querySelectorAll<HTMLAnchorElement>('a')
      .forEach(link => {
        link.removeEventListener('click', this.closeMenu);
      });

    document.removeEventListener(
      'click',
      this.handleOutsideClick
    );

    document.removeEventListener(
      'keydown',
      this.handleKeyboard
    );

    window.removeEventListener(
      'resize',
      this.handleResize
    );

    window.removeEventListener(
      'scroll',
      this.handleScroll
    );

    this.emailButton?.removeEventListener(
      'click',
      this.openEmailDialog
    );

    this.emailCloseButton?.removeEventListener(
      'click',
      this.closeEmailDialog
    );

    this.copyEmailButton?.removeEventListener(
      'click',
      this.copyEmail
    );

    this.emailDialog?.removeEventListener(
      'click',
      this.handleDialogClick
    );

    document.body.classList.remove('modal-open');
  }
}

export { App as AppComponent };
