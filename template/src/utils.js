var FuncRenderLocalDate = function(timestamp){
  return (new Date(timestamp)).toLocaleString();
};

var FuncRenderBoolean = function(value){
  return value ? 'Sim' : 'Não';
};

export {
  FuncRenderBoolean,
  FuncRenderLocalDate
};
