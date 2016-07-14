var extractListItemFromRow = function ($row) {
    var row = {}, $input;
    $row.find('input').each(function () {
        $input = $(this);
        row[$input.attr('name')] = $input.val();
    });
    return row;
};

var $form = $('#entityForm');

var drake = dragula([$form.find('tbody').get(0)]);

$form.on('click', 'tfoot button', function (event) {
    var clone = $form.find('tfoot tr').clone();
    clone.find('button').removeClass('btn-primary').addClass('btn-default').text('×');
    $form.find('tbody').append(clone);
    event.preventDefault();
}).on('click', 'tbody button', function (event) {
    $(this).closest('tr').remove();
    event.preventDefault();
}).on('submit', function entityListSubmit(event) {

    var entity = {
        name: $('#entityName').val(),
        type: $('#entityType').val()
    };

    var itemsPropName = $('#itemsPropName').val();
    var entityId = $('#entityId').val();

    entity[itemsPropName] = [];

    $('#entity-list-items').find('tr').each(function () {
        entity[itemsPropName].push(extractListItemFromRow($(this)));
    });

    $.ajax({
        url: '/admin/entities/' + entity.type + '/' + entityId,
        method: (entityId) ? 'PUT' : 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(entity)
    }).done(function (entity) {
        window.location.href = '/admin/entities/' + entity.type + '/' + entity._id;
    });
    event.preventDefault();
});


$('.arrow').on('click', function(){
    var $li =$(this).closest('li');
    $li.toggleClass('open');
    sessionStorage.setItem('adminentities.' + $li.attr('data-path'), $li.hasClass('open'));
});

$('li[data-path]').each(function(){
    var $li = $(this);
    var state = sessionStorage.getItem('adminentities.' + $li.attr('data-path'));
    if(state && state !== 'false'){
        $li.addClass('open');
    }
});