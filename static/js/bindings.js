(function() {
	"use strict";

	function es5Preprocess(val) {
		var alt = val.split('.');
		var tail = alt.pop();
		if (alt.length == 0) alt.push('$data');
		tail = 'ko.getObservable( ' + alt.join('.') + ', ' + '\'' + tail + '\'' + ' )';
		return tail + ' || ' + val;
	};
	window.ko.es5.customBinding = function(name, binding) {
		binding.preprocess = es5Preprocess;
		window.ko.bindingHandlers[name] = binding;
	};

	window.ko.es5.customBinding('contentEditable', {
		init: function(element, valueAccessor) {
			var val = valueAccessor();
			element.onkeyup = function() {
				val(element.innerText);
			};
		},
		update: function(element, valueAccessor) {
			var val = valueAccessor()()
			if (val == "")
				element.innerText = val;
		}
	});
})();
