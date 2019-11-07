
// --- arquivo de validações

module.exports = app => {

    function existsOrEroor(value, meg) {
        if (!value) throw msg;
        if (Array.isArray(value) && value.length === 0) throw msg;
        if (typeof value === 'string' && !value.trim()) throw msg;
    };
    
    function notExistsOrEroor(value, meg) {
        try {
            existsOrEroor(value, msg);
        } catch (error) {
            return
        }
        throw msg;
    };
    
    function equalOrErro(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg;
    }

    return { existsOrEroor, notExistsOrEroor, equalOrErro };
};
