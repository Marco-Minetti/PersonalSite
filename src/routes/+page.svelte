<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Laptop from '$lib/components/Laptop.svelte';
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Education from '$lib/components/Education.svelte';
	import Beyond from '$lib/components/Beyond.svelte';
	import Contact from '$lib/components/Contact.svelte';

	const description =
		'Marco Minetti: Computer Science student at UW–Madison. AI Engineer Intern at Reply (LLM knowledge systems), four internships, full-stack and systems projects.';
</script>

<svelte:head>
	<title>Marco Minetti · Computer Science @ UW–Madison</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Marco Minetti · Computer Science @ UW–Madison" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<Nav />

<main>
	<Hero />
	<Laptop />
	<About />
	<Experience />
	<Projects />
	<Skills />
	<Education />
	<Beyond />
	<Contact />
</main>
