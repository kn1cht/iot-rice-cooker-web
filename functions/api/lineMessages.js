const warningText = cooker => {
  return [
    { cond : !cooker.water, text : '炊飯用の水が不足しています'},
    { cond : cooker.waste, text : '排水タンクが満水です'},
    { cond : cooker.isRiceShortage, text : '炊飯用の米が不足しています'},
  ].reduce((text, warning) => text + (warning.cond ? `\n\u26a0 ${warning.text}` : ''), '');
}

const confirmTemplate = (dataTemplate, text) => {
  return {
    type     : 'template',
    altText  : 'Warning Confirmation',
    template : {
      type    : 'confirm',
      text,
      actions : [
        {
          type  : 'postback',
          label : '開始する',
          data  : JSON.stringify(Object.assign(dataTemplate, { action : 'confirm' }))
        },
        {
          type  : 'postback',
          label : 'キャンセル',
          data  : JSON.stringify(Object.assign(dataTemplate, { action : 'cancel' }))
        }
      ]
    }
  };
}

const menuTemplate = (dataTemplate, text) => {
  return {
    type     : 'template',
    altText  : 'Suihan Menu Buttons',
    template : {
      type    : 'buttons',
      text,
      actions : [
        {
          type  : 'postback',
          label : '1合',
          data  : JSON.stringify(Object.assign(dataTemplate, { amount : 1 }))
        },
        {
          type  : 'postback',
          label : '2合',
          data  : JSON.stringify(Object.assign(dataTemplate, { amount : 2 }))
        },
        {
          type  : 'postback',
          label : '3合',
          data  : JSON.stringify(Object.assign(dataTemplate, { amount : 3 }))
        }
      ]
    }
  };
}

module.exports = {
  confirmTemplate,
  warningText,
  menuTemplate
};
