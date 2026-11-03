
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
    this.initializeLanguage();
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
      this.currentLanguage === 'en' ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : (isDark ? 'Ativar modo claro' : 'Ativar modo escuro')
    );
    this.themeButton.setAttribute(
      'aria-pressed',
      String(isDark)
    );
    this.themeButton.title =
      this.currentLanguage === 'en' ? (isDark ? 'Light mode' : 'Dark mode') : (isDark ? 'Modo claro' : 'Modo escuro');
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
      this.currentLanguage === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fechar menu' : 'Abrir menu')
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
      this.applyLanguage();
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
      this.copyEmailButton.textContent = this.currentLanguage === 'en' ? 'Copy' : 'Copiar';
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
        this.copyEmailButton.textContent = this.currentLanguage === 'en' ? 'Copied!' : 'Copiado!';
      }
      if (feedback) {
        feedback.textContent = this.currentLanguage === 'en' ? 'Email address copied.' : 'Endereço de e-mail copiado.';
      }
    } catch {
      if (feedback) {
        feedback.textContent = this.currentLanguage === 'en' ? 'Could not copy automatically. Please select and copy the email address above.' : 'Não foi possível copiar automaticamente. Selecione o endereço acima para copiar.';
      }
    }
  };

  private currentLanguage: 'pt' | 'en' = 'pt';
  private readonly originalText = new WeakMap<Text, string>();
  private readonly originalAttributes = new WeakMap<Element, Map<string, string>>();
  private readonly dictionary: Record<string, string> = {
    "Portfólio": "Portfolio",
    "Sobre": "About",
    "Tecnologias": "Technologies",
    "Experiência": "Experience",
    "Projetos": "Projects",
    "Certificações": "Certifications",
    "Contato": "Contact",
    "Aberta a estágio ou vaga júnior": "Open to internships and junior roles",
    "Oi, eu sou a Giovanna.": "Hi, I’m Giovanna.",
    "Desenvolvedora Front-End em formação": "Aspiring Front-End Developer",
    "Estudante de Análise e Desenvolvimento de Sistemas. Meu desejo é seguir carreira em Front-End, e também tenho interesse em Full-Stack para entender um projeto de ponta a ponta.": "I’m studying Systems Analysis and Development, with a goal of building my career in Front-End development. I’m also interested in Full-Stack development to understand how projects come together from end to end.",
    "Baixar currículo": "Download résumé",
    "Ver projetos": "View projects",
    "foco:": "focus:",
    "interesse:": "interest:",
    "local:": "location:",
    "Git e GitHub": "Git and GitHub",
    "Sobre mim": "About me",
    "Minha trajetória reúne formação em tecnologia, experiência com pessoas e interesse por design. São conhecimentos que influenciam a maneira como desenvolvo interfaces.": "My background combines technology education, experience working with people, and a passion for design. Together, they shape how I build interfaces.",
    "Gosto de ver uma interface ganhar forma na tela: o layout, a responsividade e as pequenas animações que deixam tudo mais agradável de usar. Venho do atendimento e do suporte técnico, e isso me ensinou a me comunicar com clareza e a resolver problemas com calma.": "I love seeing an interface come to life: the layout, responsive details, and subtle animations that make it enjoyable to use. My background in customer service and technical support taught me to communicate clearly and solve problems thoughtfully.",
    "Também sou apaixonada por arte em todas as formas, e isso aparece na atenção que dou às cores, aos espaços e aos detalhes de cada projeto.": "I’m also passionate about art in all its forms, and that shows in the attention I give to color, spacing, and the little details in every project.",
    "Formação": "Education",
    "Análise e Desenvolvimento de Sistemas": "Systems Analysis and Development",
    "4º semestre, conclusão em julho de 2027": "4th semester · Expected graduation: July 2027",
    "Idiomas": "Languages",
    "Português": "Portuguese",
    "Nativo": "Native",
    "Inglês": "English",
    "Intermediário": "Intermediate",
    "Fora do código": "Beyond coding",
    "Desenho": "Drawing",
    "Crochê": "Crochet",
    "Jogos": "Gaming",
    "Séries": "TV series",
    "Tecnologias, bibliotecas e fundamentos que utilizo em projetos, estudos e experiências profissionais. As categorias também incluem ferramentas que estou aprofundando no momento.": "Technologies, libraries, and core skills I use in projects, coursework, and professional experience. These categories also include tools I’m currently exploring in greater depth.",
    "Minha trajetória passa pelo atendimento ao cliente, análise de ocorrências e estágio em tecnologia. Essas experiências desenvolveram minha comunicação, atenção aos detalhes e compreensão das necessidades dos usuários.": "My experience spans customer service, case analysis, and a technology internship. These roles strengthened my communication skills, attention to detail, and understanding of user needs.",
    "Atendimento e suporte técnico": "Customer service and technical support",
    "Suporte remoto, diagnóstico de problemas e orientação técnica para resolver dúvidas com clareza e agilidade.": "Remote support, troubleshooting, and technical guidance to resolve questions clearly and efficiently.",
    "Análise de fraudes": "Fraud analysis",
    "Investigação de ocorrências bancárias, identificação de indícios de fraude e análise criteriosa de informações.": "Investigating banking cases, identifying signs of fraud, and carefully reviewing information.",
    "Estágio em tecnologia": "Technology internship",
    "Testes de QA e prototipação de interfaces no Figma, em colaboração com a equipe de desenvolvimento.": "QA testing and interface prototyping in Figma, working alongside the development team.",
    "PORTFÓLIO": "PORTFOLIO",
    "Projetos em destaque": "Featured projects",
    "Do conceito à interface: dois projetos com propostas diferentes, desenvolvidos com atenção à experiência de uso e às tecnologias por trás de cada solução.": "From concept to interface: two distinct projects built with a focus on user experience and the technology behind each solution.",
    "Clique em um projeto para explorar os detalhes": "Select a project to explore the details",
    "Aplicação web • Full-Stack": "Web application • Full-Stack",
    "Visualização do projeto": "Project preview",
    "01 / HACKATHON ACADÊMICO": "01 / UNIVERSITY HACKATHON",
    "02 / PROJETO PESSOAL": "02 / PERSONAL PROJECT",
    "Plataforma web de veículos que reúne catálogo, comparação de modelos, captura de leads e painel administrativo. Inclui um assistente inteligente integrado ao Gemini com RAG, permitindo consultar informações dos veículos.": "A vehicle platform featuring a catalog, model comparisons, lead capture, and an admin dashboard. It also includes an AI assistant powered by Gemini and RAG to answer questions about the vehicles.",
    "Tecnologias utilizadas": "Technologies used",
    "Explorar o código": "Explore the code",
    "Landing page criada para apresentar peças artesanais em crochê. Desenvolvi a estrutura semântica, a composição visual e a responsividade, com navegação intuitiva e uma identidade acolhedora para destacar os produtos.": "A landing page showcasing handmade crochet pieces. I developed its semantic structure, visual design, and responsive layout, with intuitive navigation and a warm identity that puts the products in the spotlight.",
    "Outros estudos e experimentos também fazem parte do meu processo de aprendizado.": "Other studies and experiments are also part of my learning journey.",
    "Ver mais no GitHub": "See more on GitHub",
    "APRENDIZADO CONTÍNUO": "CONTINUOUS LEARNING",
    "Cursos que estou realizando para aprofundar meus conhecimentos em Front-End, design de interfaces e desenvolvimento web. Os certificados serão adicionados conforme a conclusão.": "Courses I’m taking to deepen my knowledge of Front-End development, interface design, and web development. I’ll add certificates as I complete them.",
    "Formação Front-end: HTML, CSS, JavaScript, React e mais": "Front-End Training: HTML, CSS, JavaScript, React, and more",
    "Figma: design colaborativo do básico ao protótipo responsivo": "Figma: Collaborative Design from Basics to Responsive Prototypes",
    "Git e GitHub do básico ao avançado com Gist e GitHub Pages": "Git and GitHub: From Basics to Advanced, with Gist and GitHub Pages",
    "Node.js do zero à maestria com diversos projetos": "Node.js: From Beginner to Advanced, with Hands-On Projects",
    "Certificado após conclusão": "Certificate upon completion",
    "Em andamento": "In progress",
    "< aprendizado contínuo />": "< continuous learning />",
    "Aprendendo, praticando e evoluindo a cada projeto.": "Learning, practicing, and growing with every project.",
    "Vamos conversar?": "Let’s connect!",
    "Busco oportunidades de estágio ou nível júnior em desenvolvimento Front-End, unindo código, criatividade e atenção à experiência do usuário. Também tenho interesse em Full-Stack e Testes de QA, porque gosto de entender como as aplicações funcionam de ponta a ponta e como torná-las mais confiáveis. Vamos criar algo juntos?": "I’m looking for internship or junior opportunities in Front-End development, combining code, creativity, and attention to user experience. I’m also interested in Full-Stack development and QA testing because I like understanding how applications work from end to end and how to make them more reliable. Let’s build something together!",
    "Enviar e-mail": "Send an email",
    "Entre em contato": "Get in touch",
    "Envie uma mensagem pelo Gmail ou copie meu endereço de e-mail.": "Send me a message through Gmail or copy my email address.",
    "Copiar": "Copy",
    "Copiado!": "Copied!",
    "Escrever pelo Gmail": "Write via Gmail",
    "Front-End": "Front-End",
    "Bibliotecas": "Libraries",
    "Dados e IA": "Data & AI",
    "Qualidade": "Quality assurance",
    "Ferramentas": "Tools",
    "Estudando agora": "Currently learning",
    "Tecnologias para construir interfaces responsivas.": "Technologies for building responsive interfaces.",
    "Frameworks e bibliotecas utilizados em projetos.": "Frameworks and libraries used in my projects.",
    "Banco de dados e integração com inteligência artificial.": "Databases and artificial intelligence integration.",
    "Testes e acompanhamento do desenvolvimento.": "Testing and development quality assurance.",
    "Ferramentas que utilizo no meu fluxo de trabalho.": "Tools I use in my workflow.",
    "Ferramentas de desenvolvimento e versionamento.": "Development and version control tools.",
    "Tecnologias e conhecimentos em desenvolvimento.": "Technologies and skills I’m currently developing.",
    "Tecnologias que estou estudando e aprofundando.": "Technologies I’m currently studying and exploring.",
    "HTML5 semântico": "Semantic HTML5",
    "Variáveis CSS": "CSS variables",
    "Testes manuais de QA": "Manual QA testing",
    "React avançado": "Advanced React",
    "Git avançado": "Advanced Git",
    "Ativar modo claro": "Switch to light mode",
    "Ativar modo escuro": "Switch to dark mode",
    "Modo claro": "Light mode",
    "Modo escuro": "Dark mode",
    "Abrir menu": "Open menu",
    "Fechar menu": "Close menu",
    "Endereço de e-mail copiado.": "Email address copied.",
    "Não foi possível copiar automaticamente. Selecione o endereço acima para copiar.": "Could not copy automatically. Please select and copy the email address above.",
    "Não foi possível copiar.": "Could not copy.",
    "Navegação principal": "Main navigation",
    "Selecionar idioma": "Select language",
    "Alternar modo claro e escuro": "Toggle light and dark mode",
    "Alternar tema": "Toggle theme",
    "Categorias de tecnologias": "Technology categories",
    "Selecionar projeto para visualizar": "Select a project to preview",
    "Abrir o repositório do AutoStore AI": "Open the AutoStore AI repository",
    "Abrir o repositório do Ateliê da Lina": "Open the Ateliê da Lina repository",
    "Captura real da interface do AutoStore AI": "Screenshot of the AutoStore AI interface",
    "Captura real da landing page Ateliê da Lina": "Screenshot of the Ateliê da Lina landing page",
    "Homem-Aranha usando fones de ouvido": "Spider-Man wearing headphones",
    "Snoopy detetive com lupa": "Detective Snoopy with a magnifying glass",
    "Pikachu trabalhando no computador": "Pikachu working at a computer",
    "Gatinho desenhado em preto e branco": "Black-and-white cat illustration",
    "Nível 5 de 5": "Level 5 out of 5",
    "Nível 3 de 5": "Level 3 out of 5"
  };
  private readonly normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim();

  private initializeLanguage(): void {
    const pt = document.getElementById('lang-pt');
    const en = document.getElementById('lang-en');
    if (!(pt instanceof HTMLButtonElement) || !(en instanceof HTMLButtonElement)) return;
    pt.addEventListener('click', this.selectPortuguese);
    en.addEventListener('click', this.selectEnglish);
    let saved: 'pt' | 'en' = 'pt';
    try { if (localStorage.getItem('portfolio-language') === 'en') saved = 'en'; } catch {}
    this.setLanguage(saved);
  }
  private readonly selectPortuguese = (): void => this.setLanguage('pt');
  private readonly selectEnglish = (): void => this.setLanguage('en');

  private setLanguage(language: 'pt' | 'en'): void {
    this.currentLanguage = language;
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
    ['pt', 'en'].forEach(code => {
      const button = document.getElementById(`lang-${code}`);
      button?.classList.toggle('active', code === language);
      button?.setAttribute('aria-pressed', String(code === language));
    });
    this.applyLanguage();
    const cv = document.getElementById('cv-download');
    if (cv instanceof HTMLAnchorElement) {
      const filename = language === 'en'
        ? 'CV_Giovanna_Carolina_EN.pdf'
        : 'CV_Giovanna_Carolina.pdf';
      cv.href = new URL(filename, document.baseURI).href;
      cv.download = filename;
    }
    const emailLinks = document.querySelectorAll<HTMLAnchorElement>('.email-options a');
    const subject = encodeURIComponent(language === 'en' ? 'Portfolio contact' : 'Contato pelo portfólio');
    emailLinks.forEach(link => {
      if (link.href.startsWith('mailto:')) link.href = `mailto:${this.email}?subject=${subject}`;
      else if (link.href.includes('mail.google.com')) link.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}&su=${subject}`;
    });
    this.updateThemeButton();
    this.startMarquee();
    try { localStorage.setItem('portfolio-language', language); } catch {}
  }

  private applyLanguage(): void {
    const root = document.querySelector('app-root');
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      if (textNode.parentElement?.closest('script, style')) continue;
      const original = this.originalText.get(textNode) ?? textNode.textContent ?? '';
      if (!this.originalText.has(textNode)) this.originalText.set(textNode, original);
      const normalized = this.normalizeText(original);
      const translated = this.currentLanguage === 'en' ? this.dictionary[normalized] : undefined;
      if (!translated) { textNode.textContent = original; continue; }
      const prefix = original.match(/^\s*/)?.[0] ?? '';
      const suffix = original.match(/\s*$/)?.[0] ?? '';
      textNode.textContent = prefix + translated + suffix;
    }
    const attrs = ['alt', 'aria-label', 'title', 'placeholder'];
    root.querySelectorAll('*').forEach(element => {
      let originals = this.originalAttributes.get(element);
      if (!originals) { originals = new Map<string, string>(); this.originalAttributes.set(element, originals); }
      attrs.forEach(attribute => {
        const current = element.getAttribute(attribute);
        if (current === null) return;
        if (!originals!.has(attribute)) originals!.set(attribute, current);
        const original = originals!.get(attribute)!;
        element.setAttribute(attribute, this.currentLanguage === 'en' ? (this.dictionary[original] ?? original) : original);
      });
    });
  }

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
    document.getElementById('lang-pt')?.removeEventListener('click', this.selectPortuguese);
    document.getElementById('lang-en')?.removeEventListener('click', this.selectEnglish);
  }
}
export { App as AppComponent };
