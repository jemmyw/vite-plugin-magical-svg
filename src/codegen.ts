/*!
 * Copyright (c) Cynthia Rey et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Builder } from 'xml2js'

type XmlValue = string | undefined

function renderHtml (xml: any, useSymbol: boolean) {
	const symbol = new Builder({ headless: true, renderOpts: { pretty: false } }).buildObject({ symbol: xml.svg })
	return useSymbol
		? JSON.stringify(`${symbol}<use href='#${xml.svg.$.id}'/>`)
		: JSON.stringify(symbol)
}

export type SupportedTarget =
	| 'dom'
	| 'react'
	| 'react-jsx'
	| 'preact'
	| 'preact-jsx'
	| 'vue'
	| 'solid'

export function generateDev (target: SupportedTarget, xml: any): string {
	return `
		import { createSvgDEV } from 'vite-plugin-magical-svg/runtime/${target}.js';
		export default createSvgDEV(
			'${xml.svg.$.viewBox || ''}',
			'${xml.svg.$.width || ''}',
			'${xml.svg.$.height || ''}',
			${renderHtml(xml, true)}
		);
	`
}

export function generateProd (target: SupportedTarget, viewBox: XmlValue, width: XmlValue, height: XmlValue, symbol: string): string {
	return `
		import { createSvg } from 'vite-plugin-magical-svg/runtime/${target}.js';
		export default createSvg(
			'${viewBox || ''}',
			'${width || ''}',
			'${height || ''}',
			${symbol}
		);
	`
}

export function inlineSymbol (xml: any): string {
	return `
		;(() => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			svg.setAttribute('height', '0')
			svg.setAttribute('width', '0')
			svg.setAttribute('viewBox', '${xml.svg.$.viewBox}')
			svg.innerHTML = ${renderHtml(xml, false)}
			document.body.prepend(svg)
		})();
	`
}
