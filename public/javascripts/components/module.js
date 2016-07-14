var initModules = function (container, target) {
    var $debug = $('#debug');
    var $modules = $(container).find('.panjeeModules');

    function getval(root, path) {
        var tmp = root, parts = ('' + path).split('.'), i = 0;
        for (; i < parts.length; i++) {
            if (typeof tmp[parts[i]] === 'undefined') {
                return;
            }
            tmp = tmp[parts[i]];
        }
        return tmp;
    }

    function setval(root, path, value) {
        var tmp = root, parts = ('' + path).split('.'), i = 0;
        for (; i < parts.length - 1; i++) {
            if (typeof tmp[parts[i]] === 'undefined') {
                tmp[parts[i]] = {};
            }
            tmp = tmp[parts[i]];
        }
        if (typeof value === 'undefined') {
            delete tmp[parts[parts.length - 1]];
            return;
        }
        tmp[parts[parts.length - 1]] = value;
    }

    function reset() {
        $(container).find('.panjeeModule').each(function () {
            valueDidChange($(this));
        });
    }

    $(container).find('.panjeeModule').each(function () {
        var $this = $(this);
        valueDidChange($this);

        $this.on('change', function (event) {
            var $input = $(event.target);
            setval(target, $input.attr('data-name'), $input.val());
            $input.attr('data-value', $input.val());
            valueDidChange($this, $input, function () {
                $debug.text(JSON.stringify(target, null, 2));
            });
        });
    });


    function valueDidChange($module, $targetInput, cb) {

        console.info('valueDidChange', $module[0]);

        cb = cb || new Function();

        $module.find('[data-type=text] input').each(function(){
            var $input = $(this);
            if($input.attr('data-value')){
                $input.val($input.attr('data-value'));
            }
        });

        $module.find('[data-choices]').each(function () {
            var $select = $(this);
            var choicesPath = $(this).data('choices');

            var pathContainsUndefinedParts = false;
            var resolved = choicesPath.replace(/\{([\.\w]+)\}/g, function (whole, part) {
                var ref = getval(target, part);
                if (typeof ref === 'undefined') {
                    pathContainsUndefinedParts = true;
                }
                return ref;
            });

            if (pathContainsUndefinedParts) {
                setval(target, $select.data('name'), undefined);
                return cb();
            }

            if ($select.attr('data-path') !== resolved) {
                $.getJSON('/api/entities/list/' + resolved, function (json) {
                    var options = ['<option>'];
                    if (json) {
                        json.items.forEach(function (item) {
                            options.push($('<option>').attr({value: item.name}).text(item.label));
                        });
                    }
                    $select.attr('data-path', resolved);
                    $select.empty().append(options);
                    if ($select.attr('data-value')) {
                        $select.val($select.attr('data-value'));
                    }
                    setval(target, $select.attr('data-name'), $select.val());
                    return cb();
                });
            } else {
                if ($select.attr('data-value')) {
                    $select.val($select.attr('data-value'));
                }
                cb();
            }
        });
    }

    function updateControls() {
        $(container).find('[data-name]').each(function () {
            var $control = $(this);
            var data = $control.data();
            console.info(target, data.name, getval(target, data.name));
            $control.attr('data-value', getval(target, data.name));
        });
        reset();
    }

    return {
        reset: reset,
        modules: $modules,
        updateControls: updateControls,
        getval: getval,
        setval: setval
    }
};

