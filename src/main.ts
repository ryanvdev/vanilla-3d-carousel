type NavigateEvent = (index: number) => any;

(function () {
    class FE3DCarousel {
        private _size: number = 0;
        private _currentIndex: number = 0;
        private _carouselBody: Element | null = null;
        private _carouselBtnGroup: Element | null = null;
        private _layers: HTMLCollection | undefined;
        private _delimiter: HTMLCollection | undefined;
        private _className = Object.freeze({
            center: 'center',
            left: 'left',
            right: 'right',
            direction: 'direction',
        });

        private _onNavigate: NavigateEvent | null = null;

        public get onNavigate() {
            return this._onNavigate;
        }

        public set onNavigate(v) {
            this._onNavigate = v;
            if (v) {
                v(this._currentIndex);
            }
        }

        constructor(element: HTMLElement) {
            this.mount(element);
        }

        public mount(element: HTMLElement) {
            this._carouselBody = element.getElementsByClassName('carousel-body').item(0);
            this._carouselBtnGroup = element.getElementsByClassName('carousel-btn-group').item(0);
            const delimiter = element.getElementsByClassName('carousel-delimiter').item(0);

            if (!this._carouselBody) {
                throw new Error(
                    'Can not found the carousel-body element inside the fe-3d-carousel',
                );
            }

            if (!this._carouselBtnGroup) {
                throw new Error(
                    'Can not found the carousel-btn-group element inside the fe-3d-carousel',
                );
            }

            if (!delimiter) {
                throw new Error(
                    'Can not found the carousel-delimiter element inside the fe-3d-carousel',
                );
            }

            this.mountLayers(this._carouselBody);
            this.mountButtons(this._carouselBtnGroup);
            this.mountDelimiter(delimiter);
            this.goTo(this._currentIndex);
        }

        private mountLayers(element: Element) {
            this._layers = element.children;
            this._size = this._layers.length;
            for (let i = 0; i < this._size; i++) {
                const hasCenterClassName = this._layers
                    .item(i)!
                    .classList.contains(this._className.center);
                if (hasCenterClassName) {
                    this._currentIndex = i;
                    break;
                }
            }
        }

        private mountButtons(element: Element) {
            if (element.children.length < 2) {
                throw new Error(
                    'Can not found the left button and right button in the carousel-btn-group',
                );
            }
            const btnLeft = element.children.item(0)! as HTMLButtonElement;
            const rightLeft = element.children.item(1)! as HTMLButtonElement;

            btnLeft.addEventListener('click', this.previous);
            rightLeft.addEventListener('click', this.next);
        }

        private mountDelimiter(element: Element) {
            element.innerHTML = '';

            const olElement = document.createElement('ol');

            for (let i = 0; i < this._size; i++) {
                const liElement = document.createElement('li');
                liElement.addEventListener('click', () => {
                    this.goTo(i);
                });
                olElement.appendChild(liElement);
            }

            this._delimiter = olElement.children;
            element.append(olElement);
        }

        private goTo = (index: number, direction: 'left' | 'right' = 'left') => {
            if (!this._layers || !this._delimiter) {
                throw new Error('Carousel is not mounted');
            }

            this._currentIndex = this.computeIndex(index);
            const leftIndex = this.computeIndex(this._currentIndex - 1);
            const rightIndex = this.computeIndex(this._currentIndex + 1);
            const directionIndex = direction === 'left' ? leftIndex : rightIndex;

            for (let i = 0; i < this._size; i++) {
                const layer = this._layers.item(i)!;
                const delimiterItem = this._delimiter.item(i)!;

                layer.classList.toggle(this._className.left, i === leftIndex);
                layer.classList.toggle(this._className.right, i === rightIndex);
                layer.classList.toggle(this._className.direction, i === directionIndex);
                layer.classList.toggle(this._className.center, i === this._currentIndex);
                delimiterItem.classList.toggle(this._className.center, i === this._currentIndex);
            }

            if (this._onNavigate) {
                this._onNavigate(this._currentIndex);
            }
        };

        private next = () => {
            this.goTo(this._currentIndex + 1, 'right');
        };

        private previous = () => {
            this.goTo(this._currentIndex - 1, 'left');
        };

        private computeIndex(index: number) {
            if (index >= this._size) return 0;
            if (index < 0) return this._size - 1;
            return index;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const rootElement = document.getElementById('root')!;
        const myCarousel = new FE3DCarousel(document.getElementById('carousel')!);

        myCarousel.onNavigate = (index) => {
            rootElement.style.setProperty('--bg-image', `url('/imgs/${index + 1}.jpg')`);
        };
    });
})();
