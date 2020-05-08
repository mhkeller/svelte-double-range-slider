<script>
	import DoubleRangeSlider from './DoubleRangeSlider.svelte';
	let start;
	let end;

	const nice = d => {
		if (!d && d !== 0) return '';
		return d.toFixed(2);
	}
</script>

<main>
	<h1>Hello World!</h1>
	<DoubleRangeSlider bind:start bind:end/>
	<div class="labels">
		<div class="label">{nice(start)}</div>
		<div class="label">{nice(end)}</div>
	</div>
</main>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.label:first-child {
		float: left;
	}

	.label:last-child {
		float: right;
	}
</style>
