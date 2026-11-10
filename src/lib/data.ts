// Single source of truth for the site's content (home page, résumé page, "copy as text").
// Taken from Resume_Marco_Minetti_AI.pdf; the two game projects and the hobbies come from the previous site.

export const profile = {
	name: 'Marco Minetti',
	first: 'Marco',
	last: 'Minetti',
	location: 'Madison, WI',
	email: 'marco@marcominetti.it',
	phone: '608-658-8295',
	github: 'https://github.com/Marco-Minetti',
	githubLabel: 'github.com/Marco-Minetti',
	linkedin: 'https://www.linkedin.com/in/marco-minetti-990387381',
	site: 'marco-minetti.github.io'
};

export const roles = [
	'LLM knowledge systems',
	'AI agents',
	'full-stack products',
	'fast parallel C',
	'games in Unity & Unreal'
];

export type Stat = { to: number; decimals?: number; suffix?: string; label: string };

export const stats: Stat[] = [
	{ to: 4, decimals: 1, label: 'GPA at Purdue Northwest' },
	{ to: 4, label: 'internships in Italy and the US' },
	{ to: 1000, suffix: '+', label: 'documents behind the LLM Wiki' },
	{ to: 2.5, decimals: 1, suffix: '×', label: 'faster with OpenMP' }
];

export type Job = {
	role: string;
	org: string;
	place: string;
	when: string;
	kind: 'work' | 'research';
	project?: string;
	points: string[];
	tags: string[];
};

export const experience: Job[] = [
	{
		role: 'AI Engineer Intern',
		org: 'Reply',
		place: 'Turin, Italy',
		when: 'Summer 2026',
		kind: 'work',
		points: [
			'Developed an LLM-based knowledge system (“LLM Wiki”) for Unipol, one of Italy’s largest insurers, grounding responses to support tickets across a knowledge base of 1,000+ internal documents.',
			'Implemented document-retrieval and prompt workflows to surface relevant internal knowledge and produce context-aware ticket responses for insurance operations.'
		],
		tags: ['LLMs', 'Document retrieval', 'Prompt workflows']
	},
	{
		role: 'Undergraduate Researcher, Machine Learning',
		org: 'Purdue University Northwest',
		place: 'Hammond, IN',
		when: 'Fall 2025 – Spring 2026',
		kind: 'research',
		project:
			'Predicting Course Performance Using Behavioral and Academic Indicators through Machine Learning',
		points: [
			'Developed MATLAB machine learning models to predict student academic performance and compare regression and classification approaches.',
			'Analyzed academic, behavioral, and demographic features across datasets to evaluate prediction accuracy and model performance.'
		],
		tags: ['MATLAB', 'Regression', 'Classification']
	},
	{
		role: 'Computer Science Intern',
		org: 'Virtualitics',
		place: 'Los Angeles, CA',
		when: 'Summer 2025',
		kind: 'work',
		points: [
			'Built 2 Python automation tools and 2 GitHub Actions workflows to streamline testing and deployment.',
			'Optimized C# code in Unity for an AI/ML visualization application, improving performance and usability.'
		],
		tags: ['Python', 'GitHub Actions', 'C#', 'Unity']
	},
	{
		role: 'Computer Science Intern',
		org: 'Sirius S.R.L., Energy Automation',
		place: 'Turin, Italy',
		when: 'Summer 2023',
		kind: 'work',
		points: [
			'Developed a YouTrack-integrated web application using Svelte and a C# REST API, including Gantt-chart visualization.',
			'Collaborated on internal employee tools and end-to-end features to improve workflow efficiency and usability.'
		],
		tags: ['Svelte', 'C#', 'REST API', 'YouTrack']
	},
	{
		role: 'Computer Science Intern',
		org: 'Links Management & Technology',
		place: 'Lecce, Italy',
		when: 'Summer 2022',
		kind: 'work',
		points: [
			'Built a gamified Vue.js application that rewarded users for completing real-world missions and shipped end-to-end features with the development team.'
		],
		tags: ['Vue.js', 'Gamification']
	}
];

export type Project = {
	id: 'dibs' | 'trader' | 'gatekeeper' | 'hideseek';
	name: string;
	tagline: string;
	when: string;
	stack: string[];
	text: string;
	/** the résumé's own wording (used on the résumé page) */
	resume?: { title: string; stack: string; point: string };
};

export const projects: Project[] = [
	{
		id: 'dibs',
		name: 'Dibs',
		tagline: 'Full-stack campus marketplace',
		when: 'Summer 2026',
		stack: ['Node.js', 'Express', 'PostgreSQL', 'WebSockets', 'Stripe', 'Capacitor'],
		text: 'An end-to-end campus marketplace: authentication, listings, favorites, real-time WebSocket chat, Stripe payments and webhooks, and a Capacitor mobile wrapper.',
		resume: {
			title: 'Dibs — Full-Stack Campus Marketplace',
			stack: 'Node.js, Express, PostgreSQL',
			point:
				'Built an end-to-end campus marketplace with authentication, listings, favorites, real-time WebSocket chat, Stripe payments and webhooks, and a Capacitor mobile wrapper.'
		}
	},
	{
		id: 'trader',
		name: 'Trader Analyzer',
		tagline: 'Parallel market analysis in C',
		when: 'Spring 2025',
		stack: ['C', 'OpenMP'],
		text: 'A trading-analysis tool that handles market data history of any length, with the heavy computation accelerated 2.5x with OpenMP.',
		resume: {
			title: 'Trader Analyzer',
			stack: 'C, OpenMP',
			point:
				'Built a trading-analysis tool supporting arbitrary-length market data history and accelerated computation by 2.5x with OpenMP.'
		}
	},
	{
		id: 'gatekeeper',
		name: 'Gatekeeper',
		tagline: '2D multiplayer board game',
		when: 'CS Club project',
		stack: ['Unity'],
		text: 'A four-player 2D board game: game mechanics, UI and performance tuning.'
	},
	{
		id: 'hideseek',
		name: 'Hide & Seek',
		tagline: '3D multiplayer game',
		when: 'Solo project',
		stack: ['Unreal Engine'],
		text: '3D multiplayer with matchmaking, roles and replicated game modes.'
	}
];

export const skills = [
	{
		group: 'AI / ML',
		items: [
			'LLM retrieval workflows',
			'AI agents',
			'Prompt engineering',
			'Machine learning modeling'
		]
	},
	{
		group: 'Languages',
		items: ['Python', 'Java', 'C', 'C++', 'C#', 'JavaScript', 'SQL', 'PHP', 'HTML/CSS']
	},
	{
		group: 'Tools & Frameworks',
		items: [
			'Git/GitHub',
			'GitHub Actions',
			'Linux',
			'MATLAB',
			'Svelte',
			'Vue.js',
			'Unity',
			'Unreal Engine 5',
			'OpenMP'
		]
	}
];

export const education = {
	uw: {
		school: 'University of Wisconsin–Madison',
		place: 'Madison, WI',
		when: 'Expected May 2028',
		detail: 'Computer Science (Intended), College of Letters & Science',
		extra: 'Mathematics Certificate',
		coursework: [
			'Programming III',
			'Data Structures',
			'Computer Architecture',
			'Operating Systems',
			'Systems Programming in C',
			'Discrete Mathematics',
			'Linear Algebra'
		]
	},
	pnw: {
		school: 'Purdue University Northwest',
		place: 'Hammond, IN',
		when: '2024 – 2026',
		detail: 'Computer Science coursework',
		extra: 'Dean’s List',
		gpa: '4.0'
	},
	hs: {
		school: 'E. Agnelli High School',
		place: 'Turin, Italy',
		when: 'July 2024',
		detail: 'Diploma in Computer Science'
	}
};

export const leadership = [
	{ org: 'QuantumLeap Club', role: 'Treasurer', icon: 'atom' },
	{ org: 'Investments Club', role: 'Vice President', icon: 'chart' },
	{ org: 'PNW STEM Student Union', role: 'Officer', icon: 'people' }
] as const;

export const leadershipYears = '2024–2026';

export const activities = [
	'Computer Science Club',
	'Programming Competition Club',
	'Mathematics & Statistics Club',
	'Agentic AI UW'
];

export const spoken = [
	{ lang: 'Italian', level: 'native' },
	{ lang: 'English', level: 'fluent' }
];

export const hobbies = [
	{
		id: 'quantum',
		title: 'Quantum',
		text: 'Exploring advanced concepts in quantum out of pure curiosity.'
	},
	{
		id: 'cube',
		title: 'Editing & 3D animation',
		text: 'Creative storytelling through video editing, VFX and 3D design.'
	},
	{
		id: 'drone',
		title: 'Drone cinematography',
		text: 'Capturing unique perspectives with drones and aerial shooting.'
	}
] as const;

/** Plain-text résumé for the "Copy as text" button. */
export function resumeText(): string {
	const work = experience.filter((j) => j.kind === 'work');
	const research = experience.filter((j) => j.kind === 'research');
	const { uw, pnw } = education;
	const out: string[] = [];

	out.push(profile.name.toUpperCase());
	out.push(
		`${profile.location} | ${profile.email} | ${profile.phone} | ${profile.githubLabel} | ${profile.site}`
	);

	out.push('', 'EDUCATION');
	out.push(`${uw.school} — ${uw.place}`);
	out.push(`${uw.detail} | ${uw.extra}. ${uw.when}`);
	out.push(`Relevant Coursework: ${uw.coursework.join(', ')}`);
	out.push(`${pnw.school} — ${pnw.place}`);
	out.push(`${pnw.detail}. ${pnw.extra}. GPA: ${pnw.gpa}. ${pnw.when}`);

	out.push('', 'SKILLS');
	for (const s of skills) out.push(`${s.group.replace(' / ', '/')}: ${s.items.join(', ')}`);

	out.push('', 'EXPERIENCE');
	for (const j of work) {
		out.push(`${j.role} — ${j.when}`);
		out.push(`${j.org} — ${j.place}`);
		for (const p of j.points) out.push(`• ${p}`);
	}

	out.push('', 'RESEARCH EXPERIENCE');
	for (const j of research) {
		out.push(`${j.role} | ${j.org} | ${j.when}`);
		if (j.project) out.push(`Project: ${j.project}`);
		for (const p of j.points) out.push(`• ${p}`);
	}

	out.push('', 'PROJECTS');
	for (const p of projects) {
		if (!p.resume) continue;
		out.push(`${p.resume.title} — ${p.when}`);
		out.push(p.resume.stack);
		out.push(`• ${p.resume.point}`);
	}

	out.push('', 'ACTIVITIES & LEADERSHIP');
	out.push(
		`Leadership: ${leadership.map((l) => `${l.org}, ${l.role}`).join('; ')} (${leadershipYears})`
	);
	out.push(`Activities: ${activities.join(', ')}`);
	out.push(`Languages: ${spoken.map((s) => `${s.lang} (${s.level})`).join(', ')}`);

	return out.join('\n');
}
