class PsCard extends HTMLElement {

  constructor() {
    super()
    this._data;
    this.render = this.render.bind(this)
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  connectedCallback() {
  }
  disconnectedCallback() {
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          margin: var(--space-s);
          padding: 0;
          color: var(--dark);
          background: #fff;
          height: 550px;
          width: 320px;
          position: relative;
        }

        .body {
          padding: var(--space-s);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.75);
          font-size: 14px;
          height: 190px;
        }

        ::slotted(h3) {
          margin: 0!important;
          padding: 4px var(--space-m)!important;
          font-size: 16px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.75);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        ::slotted(img) {
          box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.2);
          width: 100%;
          height: 400px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.3);
          box-sizing: border-box;
        }

        /* Small screens */
        @media only screen and (max-width: 600px) {
          .card {
            margin: var(--space-s);
            width: 240px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .card {
            background-color: var(--dark-input); 
            border-color: var(--top);
            color: var(--top);
            transition: background-color, border-color, color .5s ease-in-out;
          }
          .body {
            background-color: rgba(0,0,0,0.75); 
            transition: background-color .5s ease-in-out;
          }
          ::slotted(h3) {
            background-color: rgba(0,0,0,0.75); 
            transition: background-color .5s ease-in-out;
          }

          img {
            opacity: 0.75;
            transition: opacity .5s ease-in-out;
          }
        
          img:hover {
            opacity: 1;
            transition: opacity .5s ease-in-out;
          }
        
        }
      </style>
      <div class="card">
        <slot name="title"></slot>
        <slot name="img"></slot>
        <div class="body">
          <slot name="body"></slot>
        </div>
      </div>
    `
  }
}
export default customElements.define('ps-card', PsCard)
