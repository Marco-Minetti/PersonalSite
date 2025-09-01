<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';


  // 0 = open, 1 = closed (folded)
  const lidProgress = tweened(0, { duration: 120, easing: cubicOut });

  let raf = 0;
  const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

  // --- Typewriter state ---
  const fullText =
`$ whoami
> Marco Minetti
$ role
> CS Student @ Purdue University (4.0 GPA)
$ expertise
> Application, Website, Automation, Game Tech, C and Java, DataBase
$ contact
> mminetti@pnw.edu | github.com/Marco-Minetti | linkedin/Marco-Minetti`;

  let typed = '';
  let typingStarted = false;
  let typeIdx = 0;
  let typeTimer: number | undefined;
  let cursorBlink: number | undefined;
  let cursorVisible = true;

  function startTyping() {
    if (typeof window === 'undefined' || typingStarted) return;
    typingStarted = true;

    const step = () => {
      if (typeIdx >= fullText.length) return;
      typed += fullText[typeIdx++];
      const ch = fullText[typeIdx - 1];
      // Human-y timing: slower on newline, faster on spaces
      const delay =
        ch === '\n' ? 120 :
        ch === ' '  ? 35  :
        25 + Math.random() * 50;
      typeTimer = window.setTimeout(() => requestAnimationFrame(step), delay);
    };

    step();
    cursorBlink = window.setInterval(() => { cursorVisible = !cursorVisible; }, 500);
  }

  function stopTyping() {
    if (typeof window === 'undefined') return;
    if (typeTimer) window.clearTimeout(typeTimer);
    if (cursorBlink) window.clearInterval(cursorBlink);
  }

  // --- Scroll → folding progress ---
  function computeProgress() {
    if (typeof window === 'undefined') return 0;

    const laptop = document.getElementById('laptop');
    if (!laptop) return 0;

    const rect = laptop.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // Start/finish higher up so it feels "more up and less down"
    const start = vh * 0.0; 
    const end   = vh * 0.7; 

    const mid = rect.top + rect.height * 0.5;
    const t = 1 - (mid - start) / (end - start);
    return clamp(t);
  }

  function update() {
    lidProgress.set(computeProgress());
  }

  function onScroll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }

  onMount(() => {
    update(); // initial position
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  });

  onDestroy(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    cancelAnimationFrame(raf);
    stopTyping();
  });

  // When the lid is mostly open, kick off typing once
  $: if (typeof window !== 'undefined' && $lidProgress < 0.2) startTyping();
</script>

<main>
  <!-- NAV -->
  <nav class="fixed top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur border-b border-neutral-900">
    <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
      <div class="font-bold tracking-tight text-white">Marco Minetti</div>
      <div class="space-x-6 text-sm">
        <a href="#about" class="text-neutral-300 hover:text-white hover:underline decoration-[rgb(var(--accent))] underline-offset-4">About</a>
        <a href="#experience" class="text-neutral-300 hover:text-white hover:underline decoration-[rgb(var(--accent))] underline-offset-4">Experience</a>
        <a href="#projects" class="text-neutral-300 hover:text-white hover:underline decoration-[rgb(var(--accent))] underline-offset-4">Projects</a>
        <a href="#education" class="text-neutral-300 hover:text-white hover:underline decoration-[rgb(var(--accent))] underline-offset-4">Education</a>
        <a href="#contact" class="text-[rgb(var(--accent))] font-medium hover:brightness-110">Contact</a>
      </div>
    </div>
  </nav>

  <!-- HERO with Laptop -->
  <section class="pt-32 pb-24 text-center relative">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute -top-20 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl"
        style="background: radial-gradient(circle, rgba(var(--accent),0.14), transparent 60%)"></div>
    </div>

    <div class="max-w-6xl mx-auto px-6">
      <h1 class="text-6xl md:text-7xl font-bold text-white leading-tight opacity-0 animate-[fadeIn_0.8s_ease_forwards]">
        Building clean, fast software
        <br />with a touch of <span class="text-[rgb(var(--accent))]">neon</span>.
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-neutral-400 opacity-0 animate-[fadeInUp_0.8s_ease_0.15s_forwards]">
        Computer Science Major at Purdue University | 4.0 GPA | 3+ Years Experience in Application, Website, Automation, Game Tech, C and Java, DataBase
      </p>

      <!-- Laptop animation block -->
      <div id="laptop" class="mt-16 mx-auto relative w-[min(90vw,900px)] h-[min(55vw,520px)]" style="perspective:1200px;">
        <!-- Base / keyboard -->
        <div class="absolute inset-x-0 bottom-0 h-24 bg-neutral-900 rounded-b-xl border border-neutral-800"></div>
        <!-- Hinge -->
        <div class="absolute inset-x-0 bottom-24 h-2 bg-neutral-800 rounded-full"></div>

        <!-- Lid / screen (now starts upright ≈ -90°, closes to ≈ -110°) -->
        <div
          class="absolute left-1/2 -translate-x-1/2 bottom-24 origin-bottom w-[90%] h-[75%] rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden"
          style="
            transform: rotateX({(12 - $lidProgress * 35) * 3}deg);
            transform-style: preserve-3d;
            box-shadow: 0 40px 120px rgba(var(--accent), 0.25);
          "
        >
          <!-- Screen content -->
          <div class="relative p-4 bg-black border border-neutral-800 rounded-md font-mono text-left text-[rgb(var(--accent))]">
            <pre class="whitespace-pre-wrap leading-relaxed">{typed}{#if cursorVisible}<span class="opacity-80">▮</span>{/if}</pre>
            <!-- gentle glow -->
            <div
              class="pointer-events-none absolute inset-0"
              style="background: radial-gradient(1200px 400px at 50% 105%, rgba(var(--accent),0.25), transparent)"></div>
          </div>
        </div>

        <!-- Glow under laptop -->
        <div
          class="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] h-20 blur-3xl"
          style="background: radial-gradient(closest-side, rgba(var(--accent),0.35), transparent)"></div>
      </div>
    </div>
  </section>

    <!-- Add under the scroll hint in the HERO -->
    <p class="mt-6 flex justify-center">
      Interested in the details of my background?  
      You can view or download my full&nbsp;<span class="text-[rgb(var(--accent))] font-medium">Resume</span>&nbsp;below.
    </p>
    <div class="mt-6 flex justify-center">
        <a href="/cv" class="btn-geo btn-geo--primary">
          <span class="btn-geo__edge" aria-hidden="true"></span>
          <span class="tracking-wide">View Resume</span>
        </a>
      </div>

    <!-- HIGHLIGHTS (geometric grid tiles) -->
    <section id="about" class="py-24 border-t border-neutral-900 relative">
        <!-- subtle grid bg -->
        <div class="pointer-events-none absolute inset-0 -z-10 opacity-20"
          style="background-image:
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 36px 36px;"></div>
    
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-semibold mb-10 text-white">About</h2>
    
          <!-- lead tile -->
          <div class="grid md:grid-cols-5 gap-6">
            <article class="md:col-span-3 p-6 border border-neutral-800 bg-neutral-950">
              <h3 class="text-xl text-white font-semibold">Who am I</h3>
              <p class="mt-2 text-neutral-300">
                I’ve worked on automation tools and GitHub Actions at <span class="text-white font-medium">Virtualitics</span>,
                a YouTrack-integrated web app at <span class="text-white font-medium">Sirius</span>, and a gamified mission app at
                <span class="text-white font-medium">Links</span>. Projects include a real-time trading analyzer in C with OpenMP,
                a Unity 2D board game, and a 3D multiplayer hide-and-seek in Unreal.
              </p>
              <p class="mt-3 text-neutral-300">
                Outside class, I’m an officer in QuantumLeap, STEM Student Union, and Investments Club; and a member of CS Club,
                Programming Competition Club, and Mathematics & Statistics Club.
              </p>
            </article>
    
            <!-- geometric side tiles -->
            <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-28 h-28 border-2 border-[rgb(var(--accent))] rotate-12 opacity-60"></div>
              <h3 class="text-white font-semibold">Focus</h3>
              <p class="mt-2 text-neutral-400">Building high-performance systems and game tech, while leading and learning in STEM-focused communities.</p>
            </article>
    
            <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
              <div class="absolute -left-8 -bottom-8 w-32 h-32 border-2 border-[rgb(var(--accent))]/60 -rotate-6 opacity-60"></div>
              <h3 class="text-white font-semibold">Stack</h3>
              <p class="mt-2 text-neutral-400">Java, JavaScript, C, C#, C++, Svelte, Cisco networks, PHP, SQL, CSS, HTML, Database creation, Python, Unreal 5, Unity, GitHub, Linux</p>
            </article>
          </div>
        </div>
      </section>
    
       <!-- EXPERIENCE (3 geometric blocks) -->
  <section id="experience" class="py-24 border-t border-neutral-900 relative">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-semibold mb-10 text-white">Experience</h2>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Card 1 with accent stripe -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div class="absolute inset-y-0 left-0 w-2 bg-[rgb(var(--accent))]/40"></div>
          <h3 class="text-white font-semibold">Virtualitics — CS Intern (2025)</h3>
          <p class="mt-2 text-neutral-300">
            Built Python automation tools & GitHub Actions; optimized Unity C# for AI/ML visualization performance.
          </p>
        </article>

        <!-- Card 2 with checker edge -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div class="absolute top-0 bottom-0 right-0 w-6 opacity-25"
               style="background-image: linear-gradient(90deg, rgb(var(--accent)) 50%, transparent 50%);
                      background-size: 12px 100%;"></div>
          <h3 class="text-white font-semibold">Sirius S.R.L — CS Intern (2023)</h3>
          <p class="mt-2 text-neutral-300">
            Developed a YouTrack-integrated WebApp (Svelte + C# REST) with Gantt visualization; improved internal tools & workflows.
          </p>
        </article>

        <!-- Card 3 with dotted grid -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div class="absolute top-5.5 bottom-25 right-0 w-130 opacity-35"
              style="background-image: linear-gradient(1deg, rgb(var(--accent)) 100%, transparent 50%);
              background-size: 120px 50%;"></div>
          <h3 class="text-white font-semibold">Links — Intern (2022)</h3>
          <p class="mt-2 text-neutral-300">
            Created a gamified mission app (Vue.js) for real-world tasks; delivered both front- & back-end features.
          </p>
        </article>
      </div>
    </div>
  </section>
    
        <!-- PROJECTS (4 cards, each with distinct style) -->
  <section id="projects" class="py-24 border-t border-neutral-900">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-semibold mb-10 text-white">Projects</h2>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Project 1: accent left stripe -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div class="absolute inset-y-0 left-0 w-2 bg-[rgb(var(--accent))]/40"></div>
          <h3 class="text-white font-semibold">Trader Analyzer (C)</h3>
          <p class="mt-2 text-neutral-400">
            Real-time market analysis with linked lists, API ingestion, and OpenMP.
          </p>
        </article>

        <!-- Project 2: accent frame -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative">
          <div class="absolute inset-2 border border-[rgb(var(--accent))]/50 pointer-events-none"></div>
          <h3 class="text-white font-semibold">Gatekeeper (Unity)</h3>
          <p class="mt-2 text-neutral-400">
            2D multiplayer board game (4 players); mechanics/UI and performance tuning.
          </p>
        </article>

        <!-- Project 3: diagonal stripes -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden rounded-md shadow-sm">
          <!-- subtle diagonal pattern overlay -->
          <div class="absolute -right- -top-6 w-28 h-28 border-2 border-[rgb(var(--accent))] rotate-150 opacity-40"
               style="background-image: repeating-linear-gradient(135deg, rgba(var(--accent),0.4) 0 2px, transparent 2px 14px);"></div>
        
          <!-- content -->
          <h3 class="text-white font-semibold tracking-tight">Hide &amp; Seek (Unreal)</h3>
          <p class="mt-2 text-neutral-400">
            3D multiplayer with matchmaking, roles, and replicated game modes.
          </p>
        </article>

        <!-- Project 4: dotted background -->
        <article class="p-6 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div class="absolute inset-0 opacity-15"
               style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,.7) 1px, transparent 1px);
                      background-size: 18px 18px;"></div>
          <h3 class="text-white font-semibold">Research (In Progress)</h3>
          <p class="mt-2 text-neutral-400">
            Currently working on a research project - exploring new ideas.
          </p>
        </article>
      </div>
    </div>
  </section>

    
      <!-- EDUCATION (band with accent frame) -->
      <section id="education" class="py-24 border-t border-neutral-900 relative">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-semibold mb-6 text-white">Education</h2>
    
          <article class="p-6 border border-neutral-800 bg-neutral-950 relative">
            <div class="absolute inset-0 pointer-events-none"
              style="mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
                     -webkit-mask-composite: xor; mask-composite: exclude;"></div>
            <div class="absolute inset-3 border border-[rgb(var(--accent))]/40 pointer-events-none"></div>
    
            <p class="text-neutral-300">
              <b class="text-white">Purdue University - B.S. in Computer Science (4.0 GPA)</b><br />
              Expected May 2028 · Hammond, IN.
            </p>
            <ul class="mt-3 list-disc list-inside text-neutral-400">
              <li>Coursework: Data Structures, Systems in C, Java Programming, Computer Architecture, Multivariable Calculus.</li>
              <li>Clubs: CS Club; Programming Competition Club; QuantumLeap (Officer); STEM Student Union (Officer); Investments Club (Officer); Mathematics & Statistics Club.</li>
            </ul>
          </article>
          <article class="p-6 border border-neutral-800 bg-neutral-950 relative">
            <div class="absolute inset-0 pointer-events-none"
              style="mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
                     -webkit-mask-composite: xor; mask-composite: exclude;"></div>
            <div class="absolute inset-3 border border-[rgb(var(--accent))]/40 pointer-events-none"></div>
    
            <p class="text-neutral-300">
              <b class="text-white">E. Agnelli High School - Diploma in Computer Science</b><br />
              July 2024 · Turin, Italy
            </p>
          </article>
        </div>
      </section>


      <!-- HOBBIES -->
      <section id="hobbies" class="py-16 border-t border-neutral-900 text-center">
        <h2 class="text-2xl font-semibold text-[rgb(var(--accent))] mb-10">Beyond Tech</h2>
        <div class="flex flex-col md:flex-row md:justify-center gap-8 max-w-5xl mx-auto">
          <div class="flex-1 border border-neutral-800 rounded-lg p-6 bg-neutral-950 hover:border-[rgb(var(--accent))]/40 transition">
            <h3 class="text-white font-medium">Quantum</h3>
            <p class="mt-2 text-neutral-400 text-sm">Exploring advanced concepts in Quantum out of pure curiosity.</p>
          </div>
          <div class="flex-1 border border-neutral-800 rounded-lg p-6 bg-neutral-950 hover:border-[rgb(var(--accent))]/40 transition">
            <h3 class="text-white font-medium">Editing & 3D Animation</h3>
            <p class="mt-2 text-neutral-400 text-sm">Creative storytelling through video editing, VFX, and 3D design.</p>
          </div>
          <div class="flex-1 border border-neutral-800 rounded-lg p-6 bg-neutral-950 hover:border-[rgb(var(--accent))]/40 transition">
            <h3 class="text-white font-medium">Drone Cinematography</h3>
            <p class="mt-2 text-neutral-400 text-sm">Capturing unique perspectives with drones and aerial shooting.</p>
          </div>
        </div>
      </section>
    
      <!-- CONTACT (kept clean) -->
      <section id="contact" class="py-24 border-t border-neutral-900 text-center">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-semibold mb-6 text-white">Let’s build something</h2>
          <p class="text-neutral-300">Open to internships and collaborations where I can move fast, own problems end-to-end, and keep learning.</p>
          <div class="mt-6 space-x-4">
            <a href="mailto:mminetti@pnw.edu" class="text-[rgb(var(--accent))] hover:underline underline-offset-4">mminetti@pnw.edu</a>
            <a href="https://github.com/Marco-Minetti" target="_blank" class="hover:text-white hover:underline underline-offset-4">GitHub</a>
            <a href="https://www.linkedin.com/in/marco-minetti-990387381" target="_blank" class="hover:text-white hover:underline underline-offset-4">LinkedIn</a>
          </div>

        </div>
      </section>
    
      <footer class="py-10 border-t border-neutral-900 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} Marco Minetti — Built with SvelteKit + Tailwind
      </footer>
    </main>
