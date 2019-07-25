const getWarningText = cooker => {
  return [
    { cond : !cooker.water, text : '炊飯用の水が不足しています'},
    { cond : cooker.waste, text : '排水タンクが満水です'},
    { cond : cooker.isRiceShortage, text : '炊飯用の米が不足しています'},
  ].reduce((text, warning) => text + (warning.cond ? `\n\u26a0 ${warning.text}` : ''), '');
}

module.exports = { getWarningText };
