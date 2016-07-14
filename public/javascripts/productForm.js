var product;

var formUrl = $('#formUrl').val();
var formMethod = $('#formMethod').val();
var jsonProduct = $('#jsonProduct').val();
var organizationUrl = $('#organizationUrl').val();
var organizationProducts = {};

if (jsonProduct) {
    product = JSON.parse(jsonProduct);
} else {
    product = {
        name: '',
        props: {}
    };
}

$('button.save').click(function () {
    $.ajax({
        url: formUrl,
        data: JSON.stringify(product),
        contentType: 'application/json',
        method: formMethod
    }).done(function (product) {
        window.location.href = organizationUrl + '/products/' + product._id;
    });
});

$('#organizations-select').on('change', function () {
    var $productSelect = $('#product-select').empty();
    $.getJSON('/api/organizations/' + $(this).val() + '/products', function (products) {
        $productSelect.append('<option>');
        $(products).each(function (i, product) {
            organizationProducts[product._id] = product.props;
            $productSelect.append($('<option>').attr('value', product._id).text(product.name));
        });
    });
});

$('#product-select').on('change', function () {
    $.extend(product.props, organizationProducts[$(this).val()]);
    modules.updateControls();
});

$('#productName').on('change', function () {
    product.name = $(this).val();
});


var modules = initModules($('#productForm'), product.props);