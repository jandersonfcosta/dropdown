/*
	Dropdown 1.0.0
	Criado por Janderson Costa em 13/05/2016.

	Descrição:
		Menu suspenso.

	Recursos:
		- seleção única ou múltipla com checkboxes
		- callbacks onshow e onclose
		- retorna todos os argumentos e propriedades

	Uso:
		// html
		<div>
			<textarea onfocus="dropdown1.show(this)" rows="10"></textarea>
		</div>

		// js
		var dropdown1 = dropdown({
			type: "checkbox", // padrão "select"
			separator: ";", // padrão ","
			breakline: true, // padrão false
			readonly: true, // padrão true
			width: 200, // opcional
			height: 200, // opcional
			options: [ // options também aceita um array simples como ["option 0", "option 1", ...] onde value e text serão iguais
				{ value: "0", text: "Option 0 Option 0 Option 0" },
				{ value: "1", text: "Option 1" },
				{ value: "2", text: "Option 2" },
				{ value: "3", text: "Option 3" },
				{ value: "4", text: "Option 4" },
				{ value: "5", text: "Option 5" },
				{ value: "6", text: "Option 6" },
				{ value: "7", text: "Option 7" },
				{ value: "8", text: "Option 8" },
				{ value: "9", text: "Option 9" },
				{ value: "10", text: "Option 10" }
			],
			onshow: function() {
				console.log("Aberto");
			},
			onclose: function(value) {
				console.log(value);
				console.log("Fechado");
			}
		});
*/

(function() {

	// VARIÁVEIS GLOBAIS
	var fontSize = "9pt";

	// CONFIGURAÇÃO
	// cria e insere o componente na página
	var dropdown = document.createElement("div");
	dropdown.id = "dropdown";
	dropdown.style.fontSize = fontSize;
	dropdown.style.fontFamily = "sans-serif";
	dropdown.style.display = "none";
	dropdown.style.backgroundColor = "#fff";
	dropdown.style.border = "1px solid #ccc";
	dropdown.style.overflowX = "hidden";
	dropdown.style.overflowY = "auto";
	document.body.appendChild(dropdown);

})();


function dropdown(args) {

	// VARIÁVEIS GLOBAIS
	var
	html = document.body.parentNode,
	d = document.getElementById("dropdown");

	// PROPRIEDADES
	args.dropdown = d;
	args.type = args.type || "select";
	args.height = args.height || 225;
	args.readonly = args.readonly || true;
	args.breakline = args.breakline || false;
	args.separator = args.separator || ",";
	args.show = show;

	// FUNÇÕES
	function show(field) {
		if (d.style.display === "block")
			return false;

		// campo
		// propriedade
		args.field = field;
		setField();

		// opções
		setOptions();

		// posição/exibe
		field.parentNode.appendChild(d);
		d.style.display = "block";
		d.style.position = "absolute";

		// altura
		d.style.height = args.height;

		// largura
		d.style.width = "";
		// propriedade
		args.width = args.width || (d.clientWidth < field.clientWidth ? field.clientWidth : (d.clientWidth + 10));// 10 = margem
		d.style.width = args.width;

		// remove/adiciona eventos
		removeEvent(html, "mousedown", close);
		removeEvent(d, "mousedown", stopPropagation);
		removeEvent(field, "mousedown", stopPropagation);
		addEvent(html, "mousedown", close);
		addEvent(d, "mousedown", stopPropagation);
		addEvent(field, "mousedown", stopPropagation);

		// callback
		if (args.onshow)
			args.onshow();
	}

	function close() {
		// oculta
		d.style.display = "none";

		// remove eventos
		removeEvent(html, "mousedown", close);
		removeEvent(d, "mousedown", stopPropagation);
		removeEvent(args.field, "mousedown", stopPropagation);

		// callback
		if (args.onclose)
			args.onclose(args.value);
	}

	function setField() {
		if (args.readonly) {
			args.field.readOnly = true;
			args.field.blur();
		}
	}

	function setValue(option) {
		if (args.type === "select") {
			// vlor do campo
			var
			text = option.getAttribute("text"),
			value = option.getAttribute("value");
			args.field.value = text;

			// propriedade
			args.value = { value: value, text: text };

			// fecha
			close();
		}
		else {
			var
			values = "",
			checkboxes = d.getElementsByTagName("input");

			// propriedade
			args.value = [];

			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].checked) {
					var
					text = checkboxes[i].parentNode.getAttribute("text"),
					value = checkboxes[i].parentNode.getAttribute("value");
					args.value.push({ value: value, text: text });

					if (args.breakline)
						values += text + args.separator + "\n";
					else
						values += text + args.separator + " ";
				}
			}

			args.field.value = values.substr(0, values.lastIndexOf(args.separator));
		}
	}

	function setOptions() {
		d.innerHTML = "";

		// valor atual do campo
		if (args.type === "select")
			var fieldValue = trim(args.field.value);
		else
			var fieldValue = args.field.value.split(args.separator);

		// cria e configura as opções
		for (var i in args.options) {
			var
			value = args.options[i].value || args.options[i],
			text = args.options[i].text || args.options[i],
			label = document.createElement("label"),
			option = document.createElement("div");
			option.style.whiteSpace = "nowrap";
			option.style.cursor = "default";
			option.setAttributeNode(document.createAttribute("value"));
			option.setAttributeNode(document.createAttribute("text"));
			option.setAttribute("value", value);
			option.setAttribute("text", text);

			// type - select
			if (args.type === "select") {
				option.style.padding = "3px";

				if (fieldValue === text) {
					option.style.color = "#fff";
					option.style.backgroundColor = "#3879D9";
				}

				// evento - onclick
				option.onclick = function() {
					// atualiza o valor do campo
					setValue(this);
				};
			}
			// type - checkbox
			else {
				var input = document.createElement("input");
				input.type = "checkbox";
				input.style.padding = 0;
				input.style.margin = 0;
				input.style.marginRight = "5px";
				input.style.marginRight = "5px";

				option.style.padding = "3px";
				option.appendChild(input);

				// seleciona os checkboxes baseado no valor do campo
				for (var j in fieldValue) {
					if (text.toLowerCase() == trim(fieldValue[j]).toLowerCase())
						input.checked = true;
				}

				// evento - onclick (check/uncheck)
				option.onclick = function() {
					var tag = window.event.srcElement.tagName.toLowerCase();

					if (tag !== "input") {
						var checkbox = this.getElementsByTagName("input")[0];

						if (checkbox.checked)
							checkbox.checked = false;
						else
							checkbox.checked = true;
					}

					// atualiza o valor do campo
					setValue();
				};
			}

			// mouseover - style
			option.onmouseover = function() {
				if (this.style.color === "") // não é item selecionado ?
					this.style.backgroundColor = "#eee";
			};

			// mouseout - style
			option.onmouseout = function() {
				if (this.style.color === "")
					this.style.backgroundColor = "#fff";
			};

			// texto da opção
			label.innerHTML = text;

			option.appendChild(label);
			d.appendChild(option);
		}
	}

	function trim(string) {
		return string.replace(/^\s+|\s+$/gm,"");
	}

	function addEvent(element, event, f) {
		if (element.addEventListener) // for all major browsers, except IE 8 and earlier
			element.addEventListener(event, f);
		else if (element.attachEvent) // for IE 8 and earlier versions
			element.attachEvent("on" + event, f);
	}

	function removeEvent(element, event, f) {
		if (element.removeEventListener)
			element.removeEventListener(event, f, false);
		else if (element.detachEvent)
			element.detachEvent("on" + event, f);
	}

	function stopPropagation(e) {
		if(!e) var e = window.event;

 		e.cancelBubble = true;
		e.returnValue = false;

		//if (e.preventDefault)
		//	e.preventDefault();		

		//return false;
	}

	return args;
}