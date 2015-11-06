/*
	Origin by marcelklehr: https://github.com/marcelklehr/toposort by marcelklehr
	Fix coding style and add example by PG: https://github.com/itsPG/toposort
*/

/*
	Calling Example:

	toposort([
		['A', 'B'],
		['A', 'C'],
		['B', 'C'],
		['D', '']
	]);

	['A', 'B'] means 'A' need to be done before 'B'. ('B' depends on 'A')
*/

/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */
(function(global) {
	var exports = function(edges) {
		return toposort(uniqueNodes(edges), edges);
	};

	if (typeof global === 'undefined') {
		// do not need to install toposort into global.
	} else if (typeof global.module !== 'undefined') {
		// for node.js module
		global.module.exports = global.exports = exports;
	} else {
		// install toposort on global
		global.toposort = exports;
	}
	return exports;

	function toposort(nodes, edges) {
		var cursor = nodes.length,
			sorted = new Array(cursor),
			visited = {},
			i = cursor;

		while (i--) {
			if (!visited[i]) {
				visit(nodes[i], i, []);
			}
		}
		return sorted;

		function visit(node, i, predecessors) {
			var preds, child, outgoing;

			if(predecessors.indexOf(node) >= 0) {
				throw new Error('Cyclic dependency: '+JSON.stringify(node));
			}
			if (visited[i]) {
				return;
			}

			visited[i] = true;

			// outgoing edges
			outgoing = edges.filter(function(edge) {
				return edge[0] === node;
			});

			if (outgoing.length > 0) {
				i = outgoing.length;
				preds = predecessors.concat(node);

				do {
					child = outgoing[--i][1];
					visit(child, nodes.indexOf(child), preds);
				} while (i);
			}

			sorted[--cursor] = node;
		}
	}

	function uniqueNodes(arr) {
		var res = [],
			i, len, edge;

		for (i = 0, len = arr.length; i < len; ++i) {
			edge = arr[i];
			if (res.indexOf(edge[0]) < 0) {
				res.push(edge[0]);
			}
			if (res.indexOf(edge[1]) < 0) {
				res.push(edge[1]);
			}
		}
		return res;
	}
})(global);


