var product;

var formUrl = $('#formUrl').val();
var formMethod = $('#formMethod').val();
var jsonProduct = $('#jsonProduct').val();
var organizationUrl = $('#organizationUrl').val();

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
    $.getJSON('/api/organizations/' + $(this).val() + '/products', function (products) {
        console.info(products);
    });
});

$('#productName').on('change', function () {
    product.name = $(this).val();
});

initModules($('#productForm'), product.props);