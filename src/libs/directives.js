export function fallback(node) {
	const src = node.getAttribute('src')
	if (!src) {
		node.setAttribute('src', `https://placehold.co/32?text=${node.getAttribute('alt')}`)
	}
}
