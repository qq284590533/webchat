<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
	name: "App"
};
</script>

<style lang="stylus">
#app
	background-image url(/static/images/bg.jpg)
	background-repeat no-repeat
	width 100%
	height 100%
	background-position: center center
	background-size cover
	display flex
	justify-content center
	align-items center
</style>
