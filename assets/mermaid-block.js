/**
 * JS Code for MermaidJS Gutenberg Block
 *
 * @author automattic
 */
(function (mermaid, blocks, __, el) {
	const { Component } = wp.element;

	class MermaidBlock extends Component {
		constructor(props) {
			super(...arguments);
			this.state = {
				content: props.content ?? "",
				error: false,
			};
		}

		static getDerivedStateFromProps(props, state) {
			let content = props.content;
			try {
				mermaid.parse(content);
				return { content, error: false };
			} catch (e) {
				return { error: true };
			}
		}

		initMermaid() {
			let el = document.getElementById(this.props.id);
			el.removeAttribute("data-processed");
			el.innerHTML = this.state.content;
			mermaid.init(undefined, el);
		}

		componentDidMount() {
			this.initMermaid();
		}

		componentDidUpdate() {
			this.initMermaid();
		}

		render() {
			let classes = "mermaid";
			let errorEl = undefined;
			if (this.state.error) {
				classes += " mermaid-error";
				errorEl = el(
					"div",
					{
						className: "error",
					},
					__("Syntax Error", "merpress")
				);
			}
			this.container = el("div", {
				id: this.props.id,
				className: classes,
			});
			return [errorEl, this.container];
		}
	}

	blocks.registerBlockType("merpress/mermaidjs", {
		title: "MermaidJS",
		icon: "chart-pie",
		description: [
			__("Create diagrams and flow charts using text via Mermaid", "merpress"),
			el(
				"p",
				null,
				el(
					"a",
					{
						href: "https://mermaid-js.github.io/mermaid/#/n00b-syntaxReference",
					},
					__("Documentation", "merpress")
				)
			),
		],
		category: "formatting",

		attributes: {
			content: {
				type: "string",
				source: "text",
				selector: "pre.mermaid",
			},
		},
		supports: {
			html: false,
		},
		edit: wp.compose.withInstanceId(function (props) {
			let content = props.attributes.content;
			let editorElements = [];

			function updateContent(content) {
				props.setAttributes({ content });
			}

			if (props.isSelected) {
				editorElements = [
					el(
						"pre",
						{
							className: "mermaid-editor wp-block-code",
						},
						[
							el(wp.editor.PlainText, {
								onChange: updateContent,
								value: content,
							}),
						]
					),
					el("hr"),
				];
			}

			return el(
				"div",
				{
					className: props.className,
				},
				[
					...editorElements,
					el(MermaidBlock, {
						id: props.instanceId,
						content: content,
					}),
				]
			);
		}),

		save: function (props) {
			return el(
				"pre", // using code prevents wptexturize from breaking the content
				{
					className: "mermaid",
				},
				props.attributes.content
			);
		},
	});
})(
	window.mermaid,
	window.wp.blocks,
	window.wp.i18n.__,
	window.wp.element.createElement
);
