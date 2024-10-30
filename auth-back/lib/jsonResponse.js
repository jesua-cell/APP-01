//Conexion del Front con el Back
exports.jsonResponde = function(statusCode, body){
    return{
        statusCode,
        body
    }
}
