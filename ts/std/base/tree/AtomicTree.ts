/// <reference path="XTree.ts" />

namespace std.base.tree
{
	export class AtomicTree<T>
		extends XTree<SetIterator<T>>
	{
		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		public find(val: T): XTreeNode<SetIterator<T>>;
		public find(it: SetIterator<T>): XTreeNode<SetIterator<T>>;

		public find(val: any): XTreeNode<SetIterator<T>>
		{
			if (val instanceof SetIterator && (<SetIterator<T>>val).value instanceof SetIterator == false)
				return super.find(val);
			else
				return this.findByVal(val);
		}

		private findByVal(val: T): XTreeNode<SetIterator<T>>
		{
			if (this.root == null)
				return null;

			let node: XTreeNode<SetIterator<T>> = this.root;

			while (true)
			{
				let newNode: XTreeNode<SetIterator<T>> = null;

				if (std.equals(val, node.value.value))
					break; // EQUALS, MEANS MATCHED, THEN TERMINATE
				else if (std.less(val, node.value.value))
					newNode = node.left; // LESS, THEN TO THE LEFT
				else
					newNode = node.right; // GREATER, THEN TO THE RIGHT

				// ULTIL CHILD NODE EXISTS
				if (newNode == null)
					break;
				
				// SHIFT A NEW NODE TO THE NODE TO BE RETURNED
				node = newNode;
			}

			return node;
		}

		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
		public isEquals(left: SetIterator<T>, right: SetIterator<T>): boolean
		{
			return std.equals(left, right);
		}

		public isLess(left: SetIterator<T>, right: SetIterator<T>): boolean
		{
			return std.less(left.value, right.value);
		}
	}
}