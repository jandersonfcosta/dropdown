/*
	*** NOTAS:
		- Função removida de sp.js.
		- Esta função não está sendo usada no portal e o arquivo pode ser excluído se necessário.

	Descrição:
		Cria um controle do tipo lista suspensa para seleção de multiplos valores.
		O controle geralmente estará vinculado a um campo do tipo textbox ou textarea
		que se expande sempre que ocorrer um evento do tipo onfocus.

	Argumentos:
		field: campo que o controle estará vinculado
		options: array de opções
		height: altura máxima do controle
		width: largura máxima do controle
		optionStyle: estilo da opção
		buttonOk: botão ok
		buttonCancel: botão cancelar
		buttonOkStyle: estilo do botão ok
		buttonCancelStyle: estilo do botão cancelar
		buttonsPlaceStyle: estilo do container dos botões
		valueDisplay: inline || list
*/

function SPUI_AppendMultiSelector(args) {
	var _selector = $('<div class="SPUI-MultiSelector" style="display:none; position:absolute; cursor:default; border:1px gray solid; padding:3px; background-color:#ffffff;"></div>');
	_selector.attr("fieldId", args.field.attr("id"));
	var _optionsPlace = $('<div style="height:' + args.height + '; width:' + args.width + '; overflow-y:scroll;"></div>');

	// opções
	for (var i in args.options) {
		var option = $('<div style="' + (args.optionStyle || "width:100%; padding-right:3px; margin-right:3px;") + '" onselectstart="return false;"><input type="checkbox" style="margin-right:3px;"><span style="position:relative; top:-2px;">' + args.options[i] + '</span></div>');

		// eventos
		option.click(function(event) {
			var checkbox = $(this).find("input[type='checkbox']");

			if (!event.target.tagName.match(/input/i)) {
				checkbox.attr("checked", !checkbox.attr("checked"));
			}
		});

		option.mouseover(function() {
			$(this).css("background-color", "#f5f5f5");
		});

		option.mouseout(function() {
			$(this).css("background-color", "#fff");
		});

		// adiciona a opção
		_optionsPlace.append(option);
	}

	var _buttonsPlace = $('<div style="' + (args.buttonsPlaceStyle || "text-align:right; border-top:1px #c2c2c2 solid; padding-top:3px; margin-top:3px;") + '"></div>');

	// botão ok
	if (args.buttonOk) {
		var buttonOk = $('<input type="button" value="' + (args.buttonOk) + '" class="ms-ButtonHeightWidth ok" style="' + (args.buttonOkStyle || "width:85px;") + '">');

		// evento
		buttonOk.click(function() {
			var
				selector = $(this).parent().parent(),
				values = "",
				separator = "; ";

			if (args.valueDisplay && args.valueDisplay == "list") {
				// exibe valores em formato de lista
				separator = ";\n";
			}

			// concatena os valores selecionados
			selector.find("input[type='checkbox']").each(function() {
				if ($(this).attr("checked") == true) {
					if (values == "") {
						values += $(this).parent().text();
					} else {
						values += separator + $(this).parent().text();
					}
				}
			});

			// oculta o seletor
			selector.hide();

			// insere o valor final no campo
			$("#" + selector.attr("fieldId")).val(values);
		});

		_buttonsPlace.append(buttonOk);
	}

	// botão cancel
	if (args.buttonCancel) {
		var buttonCancel = $('<input type="button" value="' + (args.buttonCancel) + '" class="ms-ButtonHeightWidth cancel" style="' + (args.buttonCancelStyle || "width:85px; margin-right:3px;") + '">');

		// evento
		buttonCancel.click(function() {
			// oculta o seletor
			var selector = $(this).parent().parent();
			selector.hide();
		});

		_buttonsPlace.prepend(buttonCancel);
	}

	_selector.append(_optionsPlace);
	_selector.append(_buttonsPlace);

	// adiciona o controle após o campo
	args.field.parent().append(_selector);

	// campo: onfocus
	args.field.focus(function() {
		var selector = $(this).parent().find(".SPUI-MultiSelector");

		if (selector.css("display") == "none") {
			var fieldValues = $(this).val().split(";");

			// marca as opções
			selector.find("input[type='checkbox']").each(function() {
				$(this).attr("checked", "");

				for (var i in fieldValues) {
					var
						fieldValue = $.trim(fieldValues[i]),
						value = $.trim($(this).parent().text());

					if (fieldValue == value) {
						$(this).attr("checked", "checked");
					}
				}
			});

			// exibe o seletor
			selector.show();
		}
	});
}