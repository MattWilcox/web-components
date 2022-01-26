class LocalTime extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	_upgradeProperty(prop) {
		if (this.hasOwnProperty(prop)) {
			let value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	static get observedAttributes() {
		return ['utc-timestamp', 'time-style', 'date-style', 'timer'];
	}

	get utcTimestamp() {
		return this.getAttribute('utc-timestamp');
	}

	set utcTimestamp(val) { // reflect property value changes back into the DOM
		this.setAttribute('utc-timestamp', val);
	}

	get timer() {
		return this.getAttribute('timer');
	}

	set timer(val) { // reflect property value changes back into the DOM
		this.setAttribute('timer', val);
	}

	get timeStyle() {
		return this.getAttribute('time-style');
	}

	set timeStyle(val) { // reflect property value changes back into the DOM
		this.setAttribute('time-style', val);
	}

	get dateStyle() {
		return this.getAttribute('date-style');
	}

	set dateStyle(val) { // reflect property value changes back into the DOM
		this.setAttribute('date-style', val);
	}

	convertTime() {
		console.log( `convertTime called ${this.utcTimestamp}` );
		let localTime = new Date(this.utcTimestamp);
		return localTime.toLocaleString();
	}

	connectedCallback() {
		console.log('connectedCallback hit');

		// checking if any properties have already been set on the instance already, and assigning the attribute value to the property
		this._upgradeProperty('utc-timestamp');
		this._upgradeProperty('date-style');
		this._upgradeProperty('time-style');
		this._upgradeProperty('timer');

		const template = document.createElement('template');
		template.innerHTML = `
			<style>
				:host {
					/* all: initial; 1st rule so subsequent properties are reset. */
					display: inline;
					contain: content;
				}
				:host([hidden]) { display: none }
				.hide {
					display: none;
				}
			</style>

			<span id="sourceTime" class="hide"></span>
			<span id="localTime"></span>
		`;
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const sourceTime = this.shadowRoot.querySelector('#sourceTime');
		const localTime  = this.shadowRoot.querySelector('#localTime');

		sourceTime.innerHTML = this.utcTimestamp;
		localTime.innerHTML  = this.convertTime();

		this.addEventListener('click', e => {
			this.shadowRoot.querySelector('#sourceTime').classList.toggle('hide');
			this.shadowRoot.querySelector('#localTime').classList.toggle('hide');
		});
	}

	disconnectedCallback() {
		console.log('disconnectedCallback hit');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		// This is for sideeffects, like updating the DOM
		console.log(`attributeChangedCallback: ${attrName}, ${oldVal}, ${newVal}`);

		switch (attrName) {
			case 'utc-timestamp':
			case 'show':
				console.log(`Yeah we are reacting to that: ${newVal}`);
				this.convertTime();
				break;
			default:
				console.log(`Changing ${attrName} has no side-effects`);
		}
	}
}

window.customElements.define('local-time', LocalTime);