var initModules = function (container, target) {
    var $debug = $('#debug');

    function getval(root, path) {
        var tmp = root, parts = ('' + path).split('.'), i = 0;
        for (; i < parts.length; i++) {
            if (typeof tmp[parts[i]] === 'undefined') {
                return undefined;
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

    $(container).find('.panjeeModule').each(function () {
        var $this = $(this);
        valueDidChange($this);

        $this.on('change', function (event) {
            var $input = $(event.target);
            setval(target, $input.data('name'), $input.val());
            valueDidChange($this, $input, function () {
                $debug.text(JSON.stringify(target, null, 2));
            });
        });
    });

    function valueDidChange($module, $input, cb) {
        cb = cb || new Function();

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

            if ($select.data('path') !== resolved) {
                $.getJSON('/api/entities/list/' + resolved, function (json) {
                    var options = ['<option>'];
                    if (json) {
                        json.items.forEach(function (item) {
                            options.push($('<option>').attr({value: item.name}).text(item.label));
                        });
                    }
                    $select.data('path', resolved);
                    $select.empty().append(options);
                    if ($select.data('value')) {
                        $select.val($select.data('value'));
                    }
                    setval(target, $select.data('name'), $select.val());
                    return cb();
                });
            } else {
                cb();
            }
        });
    }
};

