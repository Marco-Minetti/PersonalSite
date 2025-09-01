<script lang="ts">

  const pdfHref = `/PersonalSite/static/resume/Marco-Minetti-CV.pdf`;

  let copied = false;
  const plainText = `
MARCO MINETTI
Hammond, IN 46323 ∙ (219) 368-1839 ∙ mminetti@pnw.edu ∙ GitHub: Marco-Minetti

EDUCATION
Bachelor of Computer Science — Expected May 2028
Purdue University Northwest - Hammond, IN — GPA: 4.0 Dean’s List
Diploma in Computer Science - E. Agnelli – High School - Turin, Italy — July 2024

SKILLS
• Coding Languages: Java, JavaScript, C, C#, C++, Svelte, Cisco networks, PHP, SQL, CSS, HTML, Database creation, Python, Unreal 5, Unity, GitHub, Linux
• Languages: Native Italian, fluent English

WORK EXPERIENCE
Computer Science Intern — Summer 2025
Virtualitics – Los Angeles, California
• Built Python automation tools and GitHub Actions workflows
• Optimized C# code in Unity for an AI/ML visualization app

Computer Science Intern — Summer 2023
Sirius S.R.L, Energy Automation – Turin, Italy
• Developed YouTrack-integrated WebApp (Svelte + C# REST API)
• Collaborated on internal employee tools
• Used Svelte.js + C# for REST API connections

Computer Science Intern — Summer 2022
Links Management & Technology – Lecce (Apulia), Italy
• Created a gamified mission app (Vue.js)
• Delivered front- and back-end features
• Implemented customer functionalities with Vue.js

PROJECT WORK
Trader Analyzer — C Project (Spring 2025)
• Built real-time trading analysis tool in C
• Processed live market data via API
• Optimized performance with OpenMP

Gatekeeper — CS Club Project (Fall 2024 – present)
• Developing 2D multiplayer board game with Unity
• Designed Mechanics/UI and managed code via GitHub

Hide & Seek — Solo Project (Fall 2024)
• 3D multiplayer in Unreal Engine, matchmaking/roles, replicated modes

EXTRACURRICULAR EXPERIENCE
QuantumLeap Club — Officer (Spring 2024 – Present)
PNW STEM Student Union — Officer (Spring 2024 – Present)
Investments Club — Officer (Fall 2024 – Present)
Computer Science Club — Member (Fall 2024 – Present)
Programming Competition Club — Member (Fall 2024 – Present)
Mathematics and Statistics Club — Member (Fall 2024 – Present)

RELEVANT COURSEWORK
Multivariable Calculus, Programming II (Java), Systems in C, Data Structures, Computer Architecture & Assembly
`.trim();

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(plainText);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    } catch {}
  }
</script>

<svelte:head>
  <title>Curriculum — Marco Minetti</title>
</svelte:head>

<main class="min-h-screen bg-black text-neutral-100 relative skin-dots">
  <!-- Base background: faint grid + soft radial glow -->
  <div class="pointer-events-none absolute inset-0 -z-10">
    <div class="absolute inset-0 opacity-[0.035]"
         style="background-image:
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 48px 48px;"></div>

    <div class="absolute left-1/2 top-[18%] -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl opacity-15"
         style="background: radial-gradient(circle, rgba(var(--accent),0.16), transparent 62%)"></div>
  </div>

  <!-- Header actions -->
  <header class="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-neutral-900">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/PersonalSite" class="btn-slide">← Back</a>
      <div class="flex items-center gap-3">
        <a href={pdfHref} download="Marco-Minetti-Resume.pdf" rel="external" class="btn-slit">Download PDF</a>
        <button on:click={copyAll} class="btn-underline">
          {#if copied}Copied!{:else}Copy as text{/if}
        </button>
      </div>
    </div>
  </header>

  <!-- Outer decorations (outside CV paragraphs) -->
  <div class="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
    <!-- Accent side rails -->
    <div class="hidden md:block absolute left-[calc(50%-34rem)] top-24 bottom-24 w-px"
         style="background: linear-gradient(to bottom, transparent, rgba(var(--accent),0.22) 12%, rgba(var(--accent),0.22) 88%, transparent);"></div>
    <div class="hidden md:block absolute right-[calc(50%-34rem)] top-24 bottom-24 w-px"
         style="background: linear-gradient(to bottom, transparent, rgba(var(--accent),0.22) 12%, rgba(var(--accent),0.22) 88%, transparent);"></div>

    <!-- Accent dots fields (corners) -->
    <div class="absolute top-10 left-6 w-40 h-40 opacity-[0.05]"
         style="background-image: radial-gradient(rgba(var(--accent),0.7) 1px, transparent 1px); background-size: 12px 12px;"></div>
    <div class="absolute bottom-10 right-6 w-40 h-40 opacity-[0.05]"
         style="background-image: radial-gradient(rgba(var(--accent),0.7) 1px, transparent 1px); background-size: 12px 12px;"></div>
  </div>

  <section class="py-12">
    <div class="max-w-4xl mx-auto px-6">
      <div class="relative">
        <!-- Paper layer shadows behind the CV (outside content) -->
        <div class="absolute -inset-2 -z-10">
          <div class="absolute inset-0 rounded-xl bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"></div>
          <div class="absolute inset-0 rounded-xl border border-neutral-900/60 rotate-[0.6deg] translate-y-1"></div>
          <div class="absolute inset-0 rounded-xl border border-neutral-900/50 -rotate-[0.4deg] -translate-y-1"></div>
        </div>

        <!-- Outer accent aura -->
        <div class="absolute -inset-4 rounded-xl opacity-25 blur-2xl -z-10"
             style="background: radial-gradient(60% 80% at 50% 10%, rgba(var(--accent),0.22), transparent 60%);"></div>

        <!-- Outer thin accent outline -->
        <div class="absolute -inset-[2px] rounded-xl pointer-events-none -z-10"
             style="border:1px solid rgba(var(--accent),0.35)"></div>

        <!-- CV CARD (content unchanged) -->
        <article class="relative bg-neutral-950 border border-neutral-800 rounded-lg shadow-lg overflow-hidden">
          <!-- Inner accent ring (light) -->
          <div class="pointer-events-none absolute inset-3 rounded-md"
               style="border:1px solid rgba(var(--accent),0.18)"></div>

          <div class="relative px-8 pt-8 pb-6 skin-stripe">
            <!-- Name & contacts -->
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <h1 class="text-3xl font-display text-white tracking-tight" style="color: rgba(var(--accent), 1)">MARCO MINETTI</h1> 
              <div class="text-sm text-neutral-300">
                Hammond, IN 46323
                <span class="mx-2 text-neutral-600">∙</span>
                (219) 368-1839
                <span class="mx-2 text-neutral-600">∙</span>
                <a href="mailto:mminetti@pnw.edu" class="hover:underline underline-offset-4">mminetti@pnw.edu</a>
                <span class="mx-2 text-neutral-600">∙</span>
                <a href="https://github.com/Marco-Minetti" target="_blank" class="hover:underline underline-offset-4">GitHub: Marco-Minetti</a>
              </div>
            </div>

            <div class="mt-4 h-px bg-neutral-800"></div>

            <!-- EDUCATION -->
            <section class="mt-6 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Education</h2>
              <div class="mt-2">
                <p class="text-white font-medium">Bachelor of Computer Science — Expected May 2028</p>
                <p class="text-neutral-300">Purdue University Northwest - Hammond, IN — GPA: 4.0 Dean’s List</p>
                <p class="mt-2 text-neutral-300">Diploma in Computer Science — E. Agnelli High School, Turin, Italy — July 2024</p>
              </div>
            </section>

            <!-- SKILLS -->
            <section class="mt-7 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Skills</h2>
              <ul class="mt-2 list-disc list-inside text-neutral-300 space-y-1">
                <li>Coding Languages: Java, JavaScript, C, C#, C++, Svelte, Cisco networks, PHP, SQL, CSS, HTML, Database creation, Python, Unreal 5, Unity, GitHub, Linux</li>
                <li>Languages: Native Italian, fluent English</li>
              </ul>
            </section>

            <!-- WORK EXPERIENCE -->
            <section class="mt-7 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Work Experience</h2>
              <div class="mt-2 text-neutral-300 space-y-4">
                <div>
                  <p class="text-white font-medium">Computer Science Intern — Summer 2025</p>
                  <p class="text-neutral-400">Virtualitics – Los Angeles, California</p>
                  <ul class="list-disc list-inside mt-1">
                    <li>Built Python automation tools and GitHub Actions workflows</li>
                    <li>Optimized C# code in Unity for an AI/ML visualization app</li>
                  </ul>
                </div>

                <div>
                  <p class="text-white font-medium">Computer Science Intern — Summer 2023</p>
                  <p class="text-neutral-400">Sirius S.R.L, Energy Automation – Turin, Italy</p>
                  <ul class="list-disc list-inside mt-1">
                    <li>Developed YouTrack-integrated WebApp (Svelte + C# REST API)</li>
                    <li>Collaborated on internal employee tools</li>
                    <li>Used Svelte.js + C# for REST API connections</li>
                  </ul>
                </div>

                <div>
                  <p class="text-white font-medium">Computer Science Intern — Summer 2022</p>
                  <p class="text-neutral-400">Links Management &amp; Technology – Lecce (Apulia), Italy</p>
                  <ul class="list-disc list-inside mt-1">
                    <li>Created a gamified mission app (Vue.js)</li>
                    <li>Delivered front- and back-end features</li>
                    <li>Implemented customer functionalities with Vue.js</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- PROJECT WORK -->
            <section class="mt-7 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Project Work</h2>
              <ul class="mt-2 list-disc list-inside text-neutral-300 space-y-1">
                <li><span class="text-white font-medium">Trader Analyzer — C Project (Spring 2025):</span> built real-time trading analysis tool, processed live data, optimized with OpenMP.</li>
                <li><span class="text-white font-medium">Gatekeeper — CS Club Project (Fall 2024–Present):</span> developing 2D multiplayer board game in Unity; designed UI/mechanics and managed GitHub code.</li>
                <li><span class="text-white font-medium">Hide &amp; Seek — Solo Project (Fall 2024):</span> 3D multiplayer in Unreal Engine, implemented matchmaking/roles, replicated modes.</li>
              </ul>
            </section>

            <!-- EXTRACURRICULAR -->
            <section class="mt-7 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Extracurricular Experience</h2>
              <p class="mt-2 text-neutral-300">
                QuantumLeap Club — Officer (Spring 2024 – Present) · PNW STEM Student Union — Officer (Spring 2024 – Present) ·
                Investments Club — Officer (Fall 2024 – Present) · Computer Science Club — Member (Fall 2024 – Present) ·
                Programming Competition Club — Member (Fall 2024 – Present) · Mathematics and Statistics Club — Member (Fall 2024 – Present)
              </p>
            </section>

            <!-- COURSEWORK -->
            <section class="mt-7 leading-relaxed text-[15px] text-neutral-200 skin-checker">
              <h2 class="text-[rgb(var(--accent))] font-semibold tracking-wide uppercase text-xs">Relevant Coursework</h2>
              <p class="mt-2 text-neutral-300">
                Multivariable Calculus, Programming II (Java), Systems in C, Data Structures, Computer Architecture &amp; Assembly
              </p>
            </section>
          </div>
        </article>
      </div>

      <!-- Bottom actions -->
      <div class="mt-6 flex items-center gap-3 justify-end">
        <div class="mt-6 flex items-center gap-3 justify-end">
          <a href={pdfHref} download="Marco-Minetti-Resume.pdf" rel="external" class="btn-slit">Download PDF</a>
          <button on:click={copyAll} class="btn-underline">
            {#if copied}Copied!{:else}Copy as text{/if}
          </button>
          <a href="/PersonalSite" class="btn-slide"> Back to site</a>
        </div>
    </div>
  </section>
</main>
