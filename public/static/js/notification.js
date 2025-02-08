class Notify {
    constructor() {
        /**
         * @type {HTMLElement}
         * @public
         */
        this.bar = document.getElementById('notification-bar');

        /**
         * @type {{element: HTMLElement, duration: number}[]}
         * @private
         */
        this.queue = [];

        /**
         * @type {boolean}
         */
        this.isShowing = false;
    }

    colors(type) {
        switch(type) {
            case 'success':
                return {bgColor:'bg-green-500', textColor: 'text-green-800'}
            case 'error':
                return {bgColor:'bg-red-500', textColor: 'text-red-800'}
            case 'warning':
                return {bgColor:'bg-yellow-500', textColor: 'text-yellow-800'}
            case 'info':
                return {bgColor:'bg-blue-500', textColor: 'text-blue-800'}
        }
    }

    icons(type) {
        switch(type) {
            case 'success':
                return lucide.createElement(lucide.CircleCheck);
            case 'error':
                return lucide.createElement(lucide.CircleX);
            case 'warning':
                return lucide.createElement(lucide.CircleAlert);
            case 'info':
                return lucide.createElement(lucide.CircleHelp);
        }
    }

    createElement(type, message) {
        const { bgColor, textColor } = this.colors(type);
        const icon = this.icons(type);
        const notification = document.createElement('div');
        const container = document.createElement('div');
        const text = document.createElement('p');
        const closeBtn = document.createElement('button');
        const closeIcon = lucide.createElement(lucide.X);

        notification.classList.add(
            'flex',
            'items-center',
            'justify-between',
            'w-full',
            'max-w-xl',
            'mx-auto',
            'my-2',
            'overflow-hidden',
            'shadow-md',
            'transform',
            'transition-all',
            'duration-300',
            'ease-in-out',
            bgColor,
            textColor
        );

        notification.style.transform = 'translateY(-100%)';


        container.classList.add('flex', 'items-center', 'px-4', 'py-3', 'w-full', bgColor, textColor);
        icon.classList.add('w-6', 'h-6', 'text-white', 'mr-2');
        text.classList.add('text-sm', 'font-medium', 'text-white', 'mr-4');
        closeBtn.classList.add('p-2', bgColor, textColor, `hover:${bgColor}`, 'hover:text-white', 'mr-2');
        closeIcon.classList.add('w-5', 'h-5');

        text.textContent = message;

        closeBtn.appendChild(closeIcon);
        container.append(icon, text);
        notification.append(container, closeBtn);

        closeBtn.addEventListener('click', () => this.close(notification));

        return notification;
    }

    /**
     * @private
     * @param {string} message Mensaje a mostrar
     * @param {('success'|'warning'|'error'|'info')} type Tipo de notificación
     * @param {int} duration duración en segundos
     */
    show(message, type, duration = 3) {
        const notification = this.createElement(type, message);

        this.queue.push({ element: notification, message, type, duration });

        if (!this.isShowing) {
            this.showNext();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        const queue = this.queue.shift();

        if (!queue) {
            return;
        }

        const { element, message, type, duration } = queue;

        this.isShowing = true;


        this.bar.appendChild(element);

        element.offsetHeight; // Force reflow
        element.style.transform = 'translateY(0)';

        console.log(`Notify [${type}] `, message);

        setTimeout(() => {
            // Verificar si el elemento ya fue eliminado
            if (!element.parentNode) {
                return;
            }

            this.close(element);
        }, duration * 1000);
    }

    close(element) {
        element.style.transform = 'translateY(-100%)';
        element.style.opacity = 0;

        setTimeout(() => {
            this.bar.removeChild(element);
            this.showNext();
        }, 300);
    }

    /**
     * Muestra una notificación de tipo success
     *
     * @public
     * @param {string} message Mensaje a mostrar
     * @param {number} duration duración en segundos
     */
    success(message, duration = 3) {
        this.show(message, 'success', duration);
    }

    /**
     * Muestra una notificación de tipo warning
     *
     * @public
     * @param {string} message Mensaje a mostrar
     * @param {number} duration duración en segundos
     */
    warning(message, duration = 3) {
        this.show(message, 'warning', duration);
    }

    /**
     * Muestra una notificación de tipo error
     *
     * @public
     * @param {string} message Mensaje a mostrar
     * @param {number} duration duración en segundos
     */
    error(message, duration = 3) {
        this.show(message, 'error', duration);
    }

    /**
     * Muestra una notificación de tipo info
     *
     * @public
     * @param {string} message Mensaje a mostrar
     * @param {number} duration duración en segundos
     */
    info(message, duration = 3) {
        this.show(message, 'info', duration);
    }
}

var notify = new Notify();
