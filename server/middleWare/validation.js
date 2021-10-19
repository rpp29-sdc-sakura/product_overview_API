// Products page and count input validator
const queryParamValidator = queryParams => {
    if (queryParams.count || queryParams.page) {
        const validCount = !queryParams.count || (!isNaN(parseInt(queryParams.count)) && parseInt(queryParams.count) > 0 && parseInt(queryParams.count) <= 100000);
        const validPage = !queryParams.page || (!isNaN(parseInt(queryParams.page)) && parseInt(queryParams.page) > 0);
        return validCount && validPage;
    }

    return true;
}

// Product ID validator
const productIDValidator = id => {
    return !isNaN(parseInt(id)) && parseInt(id) > 0;
}

module.exports = {
    queryParamValidator,
    productIDValidator
}