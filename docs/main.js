(function () {
    var FE3DCarousel = /** @class */ (function () {
        function FE3DCarousel(element) {
            var _this = this;
            this._size = 0;
            this._currentIndex = 0;
            this._carouselBody = null;
            this._carouselBtnGroup = null;
            this._className = Object.freeze({
                center: 'center',
                left: 'left',
                right: 'right',
                direction: 'direction',
            });
            this._onNavigate = null;
            this.goTo = function (index, direction) {
                if (direction === void 0) { direction = 'left'; }
                if (!_this._layers || !_this._delimiter) {
                    throw new Error('Carousel is not mounted');
                }
                _this._currentIndex = _this.computeIndex(index);
                var leftIndex = _this.computeIndex(_this._currentIndex - 1);
                var rightIndex = _this.computeIndex(_this._currentIndex + 1);
                var directionIndex = direction === 'left' ? leftIndex : rightIndex;
                for (var i = 0; i < _this._size; i++) {
                    var layer = _this._layers.item(i);
                    var delimiterItem = _this._delimiter.item(i);
                    layer.classList.toggle(_this._className.left, i === leftIndex);
                    layer.classList.toggle(_this._className.right, i === rightIndex);
                    layer.classList.toggle(_this._className.direction, i === directionIndex);
                    layer.classList.toggle(_this._className.center, i === _this._currentIndex);
                    delimiterItem.classList.toggle(_this._className.center, i === _this._currentIndex);
                }
                if (_this._onNavigate) {
                    _this._onNavigate(_this._currentIndex);
                }
            };
            this.next = function () {
                _this.goTo(_this._currentIndex + 1, 'right');
            };
            this.previous = function () {
                _this.goTo(_this._currentIndex - 1, 'left');
            };
            this.mount(element);
        }
        Object.defineProperty(FE3DCarousel.prototype, "onNavigate", {
            get: function () {
                return this._onNavigate;
            },
            set: function (v) {
                this._onNavigate = v;
                if (v) {
                    v(this._currentIndex);
                }
            },
            enumerable: false,
            configurable: true
        });
        FE3DCarousel.prototype.mount = function (element) {
            this._carouselBody = element.getElementsByClassName('carousel-body').item(0);
            this._carouselBtnGroup = element.getElementsByClassName('carousel-btn-group').item(0);
            var delimiter = element.getElementsByClassName('carousel-delimiter').item(0);
            if (!this._carouselBody) {
                throw new Error('Can not found the carousel-body element inside the fe-3d-carousel');
            }
            if (!this._carouselBtnGroup) {
                throw new Error('Can not found the carousel-btn-group element inside the fe-3d-carousel');
            }
            if (!delimiter) {
                throw new Error('Can not found the carousel-delimiter element inside the fe-3d-carousel');
            }
            this.mountLayers(this._carouselBody);
            this.mountButtons(this._carouselBtnGroup);
            this.mountDelimiter(delimiter);
            this.goTo(this._currentIndex);
        };
        FE3DCarousel.prototype.mountLayers = function (element) {
            this._layers = element.children;
            this._size = this._layers.length;
            for (var i = 0; i < this._size; i++) {
                var hasCenterClassName = this._layers
                    .item(i)
                    .classList.contains(this._className.center);
                if (hasCenterClassName) {
                    this._currentIndex = i;
                    break;
                }
            }
        };
        FE3DCarousel.prototype.mountButtons = function (element) {
            if (element.children.length < 2) {
                throw new Error('Can not found the left button and right button in the carousel-btn-group');
            }
            var btnLeft = element.children.item(0);
            var rightLeft = element.children.item(1);
            btnLeft.addEventListener('click', this.previous);
            rightLeft.addEventListener('click', this.next);
        };
        FE3DCarousel.prototype.mountDelimiter = function (element) {
            var _this = this;
            element.innerHTML = '';
            var olElement = document.createElement('ol');
            var _loop_1 = function (i) {
                var liElement = document.createElement('li');
                liElement.addEventListener('click', function () {
                    _this.goTo(i);
                });
                olElement.appendChild(liElement);
            };
            for (var i = 0; i < this._size; i++) {
                _loop_1(i);
            }
            this._delimiter = olElement.children;
            element.append(olElement);
        };
        FE3DCarousel.prototype.computeIndex = function (index) {
            if (index >= this._size)
                return 0;
            if (index < 0)
                return this._size - 1;
            return index;
        };
        return FE3DCarousel;
    }());
    document.addEventListener('DOMContentLoaded', function () {
        var rootElement = document.getElementById('root');
        var myCarousel = new FE3DCarousel(document.getElementById('carousel'));
        myCarousel.onNavigate = function (index) {
            rootElement.style.setProperty('--bg-image', "url('/imgs/".concat(index + 1, ".jpg')"));
        };
    });
})();
