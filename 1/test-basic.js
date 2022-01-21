class TestBasic extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	static get observedAttributes() {
		return ['animation', 'duration'];
	}

	get animation() {
		return this.getAttribute('animation');
	}

	set animation(val) {
		this.setAttribute('animation', val);
	}

	get duration() {
		return this.getAttribute('duration');
	}

	set duration(val) {
		this.setAttribute('duration', val);
	}

	connectedCallback() {
		console.log('connectedCallback hit');

		const template = document.createElement('template');
		template.innerHTML = `
			<style>
				:host {
					/* all: initial; 1st rule so subsequent properties are reset. */
					display: block;
					contain: content;
				}
				:host([hidden]) { display: none }
				p {
					color: red;
				}
				#slides {
					text-decoration: underline;
				}
				::slotted(.slide) {
					background-color: #f00; color: white;
				}
			</style>

			<p>This is a custom element, your content is below:</p>
			<div id="slides">
				<slot></slot>
			</div>
		`;
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slides = this.querySelectorAll('.slide');
		console.log(`There are ${slides.length} slides`);

		this.addEventListener('click', e => {
			console.log('click');
		});
	}

	disconnectedCallback() {
		console.log('disconnectedCallback hit');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		// This is for sideeffects, like updating the DOM
		console.log(`attributeChangedCallback: ${attrName}, ${oldVal}, ${newVal}`);

		switch (attrName) {
			case 'animation':
				if(newVal != 'fade' && newVal != 'slide') {
					console.log(`animation must be either "fade" or "slide": ${newVal}`);
					return;
				}
				break;
			default:
				console.log(`Changing ${attrName} has no side-effects`);
		}
	}
}

window.customElements.define('test-basic', TestBasic);