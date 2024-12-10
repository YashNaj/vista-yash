<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Logo from '$lib/images/vista-logo.png'
</script>

<nav class = 'md:px-10 px-6 w-full flex fixed top-0 left-0 z-[999] bg-blue-950 h-14'>
	<div class = 'container__logo logo h-full w-32 flex flex-col justify-center'>
	<img src={Logo} alt='logo' class = 'object-fit max-w-full'/>
	</div>
	<div class = 'container__yash yash h-full w-full flex items-center justify-start font-bold text-white md:ml-4 ml-2'>
		+ Yash ❤️
	</div>
	<h1 class = 'w-full h-full flex text-white items-center justify-end font-bold'>
			A simple CRUD Demo
	</h1>
</nav>

{@render children()}

<style lang='postcss'>
		:global(html){
			font-family: "Roboto", serif;
			width: 100%;
			height: auto;
			max-height: 100vh; 
background: "dce2f5";
		}
</style>
