function Timer(){
    this.time = 0;
    this.isRunning = false;
    this._callback = null;
    this._interval = 0;
    this.last = 0; // 0 increase , 1 decrease
}

Timer.prototype.increase = function(callback, interval, tick) {
	var _this = this;
	_this._curry(0)(callback, interval, tick);	
};

Timer.prototype.decrease = function(callback, interval, tick) {
	var _this = this;
	_this._curry(1)(callback, interval, tick);
}

Timer.prototype._curry = function(last){
	var _this = this;

	if(last) {
		_this._set = _this.time;
	}

	return function(callback, interval, tick) {
		if(_this.isRunning) return false;

		_this.isRunning = true;
		_this._callback = callback;
		_this._interval = interval;
		_this._tick = tick || 1000;

		_this.last = last;

		var startTime = +new Date();

		(function timer(){
			var now = +new Date(),
				differences = parseInt( (now - startTime) / 1000 );

			callback(_this.time / 1000);

			last ? (_this.time -= tick) :
				(_this.time += tick);

			if(_this.time < 0 || (interval && differences >= interval) ) {
				_this.stop();
				return;
			}

			_this.times = setTimeout(function(){
				timer();
			}, tick);
		})();
	}
};

Timer.prototype.set = function(time) {
	var _this = this;
	if(_this.isRunning) return false;
	_this.time = time * 1000;
	_this._time = _this.time;
};


Timer.prototype.stop = function() {
    var _this = this;
    clearTimeout(_this.times);
    _this.time = null;
    _this.isRunning = false;
};

Timer.prototype.parse = function() {
	var _this = this;
	clearTimeout(_this.times);
	_this.isRunning = false;
};

Timer.prototype.restore = function(){
	var _this = this;
	if(_this.last){
		_this.decrease(_this._callback, _this._interval, _this._tick);
	} else {
		_this.increase(_this._callback, _this._interval, _this._tick);
	}
};
	
Timer.prototype.restart = function() {
    var _this = this;
    _this.stop();
    if(_this._time) {
    	_this.time = _this._time;
    }
    _this.restore();
};