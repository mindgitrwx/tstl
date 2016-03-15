/// <reference path="base/container/UniqueMap.ts" />

namespace std
{
	/**
	 * <p> Tree-structured map, <code>std::map</code> of STL. </p>
	 *
	 * <p> {@link TreeMap}s are associative containers that store elements formed by a combination of a 
	 * <i>key value</i> (<code>Key</code>) and a <i>mapped value</i> (<code>T</code>), following order. </p>
	 *
	 * <p> In a {@link TreeMap}, the <i>key values</i> are generally used to sort and uniquely identify 
	 * the elements, while the <i>mapped values</i> store the content associated to this key. The types of 
	 * <i>key</i> and <i>mapped value</i> may differ, and are grouped together in member type 
	 * <code>value_type</code>, which is a {@link Pair} type combining both:
	 *
	 * <p> <code>typedef Pair<Key, T> value_type;</code> </p>
	 *
	 * <p> Internally, the elements in a {@link TreeMap} are always sorted by its <i>key</i> following 
	 * a strict weak ordering criterion indicated by its internal comparison method {@link less}.
	 *
	 * <p> {@link TreeMap} containers are generally slower than {@link HashMap HashMap} containers to 
	 * access individual elements by their <i>key</i>, but they allow the direct iteration on subsets based on 
	 * their order. </p>
	 *
	 * <p> {@link TreeMap}s are typically implemented as binary search trees. </p>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> Elements in associative containers are referenced by their <i>key</i> and not by their absolute 
	 *		 position in the container. </dd>
	 * 
	 *	<dt> Ordered </dt>
	 *	<dd> The elements in the container follow a strict order at all times. All inserted elements are 
	 *		 given a position in this order. </dd>
	 *
	 *	<dt> Map </dt>
	 *	<dd> Each element associates a <i>key</i> to a <i>mapped value</i>: 
	 *		 <i>Keys</i> are meant to identify the elements whose main content is the <i>mapped value</i>. </dd>
	 *
	 *	<dt> Unique keys </dt>
	 *	<dd> No two elements in the container can have equivalent <i>keys</i>. </dd>
	 * </dl>
	 *
	 * <ul>
	 *	<li> Reference: http://www.cplusplus.com/reference/map/map/ </li>
	 * </ul>
	 *
	 * @param <Key> Type of the keys. Each element in a map is uniquely identified by its key value.
	 * @param <T> Type of the mapped value. Each element in a map stores some data as its mapped value.
	 *
	 * @author Jeongho Nam
	 */
	export class TreeMap<Key, T>
		extends base.container.UniqueMap<Key, T>
	{
		/**
		 * <i>RB-Tree+</i> object for implemeting the {@link TreeMap}.
		 */
		private tree: base.tree.PairTree<Key, T>;

		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor
		 */
		public constructor();

		/**
		 * Contruct from elements.
		 *
		 * @param array Elements to be contained.
		 */
		public constructor(array: Array<Pair<Key, T>>);

		/**
		 * Copy Constructor.
		 *
		 * @param container Another map to copy.
		 */
		public constructor(container: base.container.MapContainer<Key, T>);

		/**
		 * Range Constructor.
		 *
		 * @param begin nput interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 */
		public constructor(begin: MapIterator<Key, T>, end: MapIterator<Key, T>);
		
		public constructor(...args: any[])
		{
			super();

			this.tree = new base.tree.PairTree<Key, T>();
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public assign<L extends Key, U extends T>
			(begin: MapIterator<L, U>, end: MapIterator<L, U>): void
		{
			super.assign(begin, end);
		}
		
		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			super.clear();

			this.tree = new base.tree.PairTree<Key, T>();
		}

		/* =========================================================
			ACCESSORS
		========================================================= */
		/**
		 * @inheritdoc
		 */
		public find(key: Key): MapIterator<Key, T>
		{
			let node = this.tree.find(key);

			if (node == null || std.equals(node.value.first, key) == false)
				return this.end();
			else
				return node.value;
		}

		/**
		 * <p> Return iterator to lower bound. </p>
		 * 
		 * <p> Returns an iterator pointing to the first element in the container whose key is not considered to 
		 * go before <i>k</i> (i.e., either it is equivalent or goes after). </p>
		 * 
		 * <p> The function uses its internal comparison object (key_comp) to determine this, returning an 
		 * iterator to the first element for which key_comp(<i>k</i>, element_key) would return false. </p>
		 * 
		 * <p> If the {@link TreeMap} class is instantiated with the default comparison type ({@link less}), 
		 * the function returns an iterator to the first element whose key is not less than <i>k</i> </p>.
		 * 
		 * <p> A similar member function, {@link upperBound}, has the same behavior as {@link lowerBound}, except 
		 * in the case that the {@link TreeMap} contains an element with a key equivalent to <i>k</i>: In this 
		 * case, {@link lowerBound} returns an iterator pointing to that element, whereas {@link upperBound} 
		 * returns an iterator pointing to the next element. </p>
		 * 
		 * @param k Key to search for.
		 *
		 * @return An iterator to the the first element in the container whose key is not considered to go before 
		 *		   <i>k</i>, or {@link TreeMap.end} if all keys are considered to go before <i>k</i>.
		 */
		public lowerBound(key: Key): MapIterator<Key, T>
		{
			let node: base.tree.XTreeNode<MapIterator<Key, T>> = this.tree.find(key);

			if (node == null)
				return this.end();
			else if (std.less(node.value.first, key))
				return node.value.next();
			else
				return node.value;
		}

		/**
		 * <p> Return iterator to upper bound. </p>
		 *
		 * <p> Returns an iterator pointing to the first element in the container whose key is considered to 
		 * go after <i>k</i> </p>.
		 *
		 * <p> The function uses its internal comparison object (key_comp) to determine this, returning an 
		 * iterator to the first element for which key_comp(<i>k</i>, element_key) would return true. </p>
		 *
		 * <p> If the {@link TreeMap} class is instantiated with the default comparison type ({@link less}), 
		 * the function returns an iterator to the first element whose key is greater than <i>k</i> </p>.
		 *
		 * <p> A similar member function, {@link lowerBound}, has the same behavior as {@link upperBound}, except 
		 * in the case that the map contains an element with a key equivalent to <i>k</i>: In this case 
		 * {@link lowerBound} returns an iterator pointing to that element, whereas {@link upperBound} returns an 
		 * iterator pointing to the next element. </p>
		 * 
		 * @param k Key to search for.
		 * 
		 * @return An iterator to the the first element in the container whose key is considered to go after 
		 *		   <i>k</i>, or {@link TreeMap.end} if no keys are considered to go after <i>k</i>.
		 */
		public upperBound(key: Key): MapIterator<Key, T>
		{
			let node: base.tree.XTreeNode<MapIterator<Key, T>> = this.tree.find(key);

			if (node == null)
				return this.end();
			else if (!std.equals(node.value.first, key) && !std.less(node.value.first, key))
				return node.value;
			else
				return node.value.next();
		}

		/**
		 * <p> Get range of equal elements. </p>
		 * 
		 * <p> Returns the bounds of a range that includes all the elements in the container which have a key 
		 * equivalent to <i>k</i> </p>.
		 * 
		 * <p> Because the elements in a {@link TreeMap} container have unique keys, the range returned will 
		 * contain a single element at most. </p>
		 * 
		 * <p> If no matches are found, the range returned has a length of zero, with both iterators pointing to 
		 * the first element that has a key considered to go after <i>k</i> according to the container's internal 
		 * comparison object (key_comp). </p>
		 * 
		 * <p> Two keys are considered equivalent if the container's comparison object returns false reflexively 
		 * (i.e., no matter the order in which the keys are passed as arguments). </p>
		 * 
		 * @param k Key to search for.
		 *
		 * @return The function returns a {@link Pair}, whose member {@link Pair.first} is the lower bound of 
		 *		   the range (the same as {@link lowerBound}), and {@link Pair.second} is the upper bound 
		 *		   (the same as {@link upperBound}).
		 */
		public equalRange(key: Key): Pair<MapIterator<Key, T>, MapIterator<Key, T>>
		{
			return new Pair<MapIterator<Key, T>, MapIterator<Key, T>>
				(this.lowerBound(key), this.upperBound(key));
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @private
		 */
		protected insertByPair<L extends Key, U extends T>(pair: Pair<L, U>): any
		{
			let node = this.tree.find(pair.first);

			// IF EQUALS, THEN RETURN FALSE
			if (node != null && std.equals(node.value.first, pair.first) == true)
				return new Pair<MapIterator<Key, T>, boolean>(node.value, false);
			
			// INSERTS
			let it: MapIterator<Key, T>;

			if (node == null)
				it = this.end();
			else if (std.less(node.value.first, pair.first) == true)
				it = node.value.next();
			else
				it = node.value;

			// ITERATOR TO RETURN
			it = this.insert(it, pair);

			return new Pair<MapIterator<Key, T>, boolean>(it, true);
		}

		/* ---------------------------------------------------------
			POST-PROCESS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handleInsert(item: MapIterator<Key, T>): void
		{
			this.tree.insert(item);
		}

		/**
		 * @inheritdoc
		 */
		protected handleErase(item: MapIterator<Key, T>): void
		{
			this.tree.erase(item);
		}
	}
}