/// <reference path="base/container/Container.ts" />

namespace std
{
	/**
	 * <p> Doubly linked list. </p>
	 *
	 * <p> {@link List}s are sequence containers that allow constant time insert and erase operations anywhere 
	 * within the sequence, and iteration in both directions. </p>
	 *
	 * <p> List containers are implemented as doubly-linked lists; Doubly linked lists can store each of the elements 
	 * they contain in different and unrelated storage locations. The ordering is kept internally by the association 
	 * to each element of a link to the element preceding it and a link to the element following it. </p>
	 *
	 * <p> They are very similar to forward_list: The main difference being that forward_list objects are 
	 * single-linked lists, and thus they can only be iterated forwards, in exchange for being somewhat smaller and 
	 * more efficient. </p>
	 *
	 * <p> Compared to other base standard sequence containers (array, vector and deque), lists perform generally 
	 * better in inserting, extracting and moving elements in any position within the container for which an iterator 
	 * has already been obtained, and therefore also in algorithms that make intensive use of these, like sorting 
	 * algorithms. </p>
	 *
	 * <p> The main drawback of lists and forward_lists compared to these other sequence containers is that they lack 
	 * direct access to the elements by their position; For example, to access the sixth element in a list, one has 
	 * to iterate from a known position (like the beginning or the end) to that position, which takes linear time in 
	 * the distance between these. They also consume some extra memory to keep the linking information associated to 
	 * each element (which may be an important factor for large lists of small-sized elements). </p>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 * 	<dt> Sequence </dt>
	 * 	<dd> Elements in sequence containers are ordered in a strict linear sequence. Individual elements are 
	 *		 accessed by their position in this sequence. </dd>
	 *
	 * 	<dt> Doubly-linked list </dt>
	 *	<dd> Each element keeps information on how to locate the next and the previous elements, allowing constant 
	 *		 time insert and erase operations before or after a specific element (even of entire ranges), but no 
	 *		 direct random access. </dd>
	 * </dl>
	 *
	 * <ul>
	 *  <li> Reference: http://www.cplusplus.com/reference/list/list/
	 * </ul>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class List<T>
		extends base.container.Container<T>
		implements base.container.IDeque<T>
	{
		public static get iterator() { return ListIterator; }

		/**
		 * An iterator of beginning.
		 */
		protected begin_: ListIterator<T>;

		/**
		 * An iterator of end. 
		 */
		protected end_: ListIterator<T>;

		/**
		 * Number of elements in the {@link List}.
		 */
		protected size_: number;

		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * <p> Default Constructor. </p>
		 *
		 * <p> Constructs an empty container, with no elements. </p>
		 */
		public constructor();

		/**
		 * <p> Initializer list Constructor. </p>
		 *
		 * <p> Constructs a container with a copy of each of the elements in <i>array</i>, in the same order. </p>
		 *
		 * @param array An array containing elements to be copied and contained.
		 */
		public constructor(items: Array<T>);

		/**
		 * <p> Fill Constructor. </p>
		 *
		 * <p> Constructs a container with <i>n</i> elements. Each element is a copy of <i>val</i> (if provided). </p>
		 *
		 * @param n Initial container size (i.e., the number of elements in the container at construction).
		 * @param val Value to fill the container with. Each of the <i>n</i> elements in the container is 
		 *			  initialized to a copy of this value.
		 */
		public constructor(size: number, val: T);

		/**
		 * <p> Copy Constructor. </p>
		 *
		 * <p> Constructs a container with a copy of each of the elements in <i>container</i>, in the same order. </p>
		 *
		 * @param container Another container object of the same type (with the same class template 
		 *					arguments <i>T</i>), whose contents are either copied or acquired.
		 */
		public constructor(container: base.container.IContainer<T>);

		/**
		 * <p> Range Constructor. </p>
		 *
		 * <p> Constructs a container with as many elements as the range (<i>begin</i>, <i>end<i>), with each 
		 * element emplace-constructed from its corresponding element in that range, in the same order. </p>
		 *
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 */
		public constructor(begin: base.container.Iterator<T>, end: base.container.Iterator<T>);

		public constructor(...args: any[])
		{
			super();

			if (args.length == 0) 
			{
				this.clear();
			}
			else if (args.length == 1 && args[0] instanceof Array) 
			{
				let array: Array<T> = args[0];

				this.clear();
				this.push(...array);
			}
			else if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof base.container.Container)) 
			{
				let container: base.container.IContainer<T> = args[0];

				this.assign(container.begin(), container.end());
			}
			else if (args.length == 2 && args[0] instanceof base.container.Iterator && args[1] instanceof base.container.Iterator) 
			{
				let begin: base.container.Iterator<T> = args[0];
				let end: base.container.Iterator<T> = args[1];

				this.assign(begin, end);
			}
			else if (args.length == 2 && typeof args[0] == "number")
			{
				let size: number = args[0];
				let val: T = <T>args[1];

				this.assign(size, val);
			}
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public assign(n: number, val: T): void;

		/**
		 * @inheritdoc
		 */
		public assign<U extends T, InputIterator extends base.container.Iterator<U>>
			(begin: InputIterator, end: InputIterator): void;

		public assign<U extends T, InputIterator extends base.container.Iterator<U>>
			(par1: any, par2: any): void
		{
			if (par1 instanceof base.container.Iterator && par2 instanceof base.container.Iterator) {
				// PARAMETERS
				let begin: InputIterator = par1;
				let end: InputIterator = par2;

				// BODY
				let prev: ListIterator<T> = null;
				let item: ListIterator<T>;

				let it = begin;

				while (true) 
				{
					// CONSTRUCT ELEMENT ITEM
					item = new ListIterator<T>
					(
						this,
						prev,
						null,
						(it != end ? it.value : null)
					);

					// SET PREVIOUS NEXT POINTER
					if (prev != null)
						prev.setNext(item);

					// CONSTRUCT BEGIN AND END
					if (it == begin)
						this.begin_ = item;
					else if (it == end) {
						this.end_ = item;
						break;
					}

					// ADD COUNTS AND STEP TO THE NEXT
					this.size_++;
					it = it.next() as InputIterator;
				}
			}
		}

		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			let it = new ListIterator(this, null, null, null);
			it.setPrev(it);
			it.setNext(it);

			this.begin_ = it;
			this.end_ = it;

			this.size_ = 0;
		}
		
		/* =========================================================
			ACCESSORS
		========================================================= */
		/**
		 * @inheritdoc
		 */
		public begin(): ListIterator<T>
		{
			return this.begin_;
		}

		/**
		 * @inheritdoc
		 */
		public end(): ListIterator<T>
		{
			return this.end_;
		}

		/**
		 * @inheritdoc
		 */
		public size(): number
		{
			return this.size_;
		}
		
		/**
		 * @inheritdoc
		 */
		public front(): T
		{
			return this.begin_.value;
		}

		/**
		 * @inheritdoc
		 */
		public back(): T
		{
			return this.end_.prev().value;
		}

		/* =========================================================
			ELEMENTS I/O
				- ITERATOR FACTORY
				- PUSH & POP
				- INSERT
				- ERASE
		============================================================
			PUSH & POP
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public push<U extends T>(...items: U[]): number 
		{
			for (let i: number = 0; i < items.length; i++)
				this.push_back(items[i]);

			return this.size();
		}
		
		/**
		 * @inheritdoc
		 */
		public push_front(val: T): void
		{
			let item: ListIterator<T> = new ListIterator(this, null, this.begin_, val);

			// CONFIGURE BEGIN AND NEXT
			this.begin_.setPrev(item);

			if (this.size_ == 0) 
			{
				// IT WAS EMPTY
				this.end_ = new ListIterator(this, item, item, null);
				item.setNext(this.end_);
			}
			else
				this.end_.setNext(item);

			// SET
			this.begin_ = item;
			this.size_++;
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: T): void
		{
			let prev: ListIterator<T> = <ListIterator<T>>this.end_.prev();
			let item: ListIterator<T> = new ListIterator(this, <ListIterator<T>>this.end_.prev(), this.end_, val);

			prev.setNext(item);
			this.end_.setPrev(item);

			if (this.empty() == true) {
				this.begin_ = item;
				item.setPrev(this.end_);
			}
			this.size_++;
		}

		/**
		 * @inheritdoc
		 */
		public pop_front(): void
		{
			this.erase(this.begin_);
		}

		/**
		 * @inheritdoc
		 */
		public pop_back(): void
		{
			this.erase(this.end_.prev());
		}
		
		/* ---------------------------------------------------------
			INSERT
		--------------------------------------------------------- */
		/**
		 * <p> Insert an element. </p>
		 *
		 * <p> The container is extended by inserting a new element before the element at the specified 
		 * <i>position</i>. This effectively increases the {@link List.size List size} by the amount of elements 
		 * inserted. </p>
		 *
		 * <p> Unlike other standard sequence containers, {@link List} is specifically designed to be efficient 
		 * inserting and removing elements in any position, even in the middle of the sequence. </p>
		 *
		 * @param position Position in the container where the new element is inserted.
		 *				   {@link iterator}> is a member type, defined as a 
		 *				   {@link ListIterator bidirectional iterator} type that points to elements.
		 * @param val Value to be inserted as an element.
		 *
		 * @return An iterator that points to the newly inserted element; <i>val</i>.
		 */
		public insert(position: ListIterator<T>, val: T): ListIterator<T>;

		/**
		 * <p> Insert elements by repeated filling. </p> 
		 *
		 * @param position Position in the container where the new elements are inserted. The {@link iterator} is a 
		 *				   member type, defined as a {@link ListIterator bidirectional iterator} type that points to 
		 *				   elements.
		 * @param size Number of elements to insert.
		 * @param val Value to be inserted as an element.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert(position: ListIterator<T>, size: number, val: T): ListIterator<T>;

		/**
		 * 
		 * @param position Position in the container where the new elements are inserted. The {@link iterator} is a 
		 *				   member type, defined as a {@link ListIterator bidirectional iterator} type that points to 
		 *				   elements.
		 * @param begin An iterator specifying range of the begining element.
		 * @param end An iterator specifying range of the ending element.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert<U extends T, InputIterator extends base.container.Iterator<U>>
			(position: ListIterator<T>, begin: InputIterator, end: InputIterator): ListIterator<T>;

		public insert(...args: any[]): ListIterator<T>
		{
			if (args.length == 2)
				return this.insert_by_val(args[0], args[1]);
			else if (args.length == 3 && typeof args[1] == "number")
			{
				return this.insertByRepeatingVal(args[0], args[1], args[2]);
			}
			else
				return this.insert_by_range(args[0], args[1], args[2]);
		}

		/**
		 * @hidden
		 */
		private insert_by_val(position: ListIterator<T>, val: T): ListIterator<T>
		{
			// SHIFT TO INSERT OF THE REPEATING VAL
			return this.insertByRepeatingVal(position, 1, val);
		}

		/**
		 * @hidden
		 */
		private insertByRepeatingVal(position: ListIterator<T>, size: number, val: T): ListIterator<T>
		{
			if (this != position.get_source())
				throw new InvalidArgument("Parametric iterator is not this container's own.");
			
			let prev: ListIterator<T> = <ListIterator<T>>position.prev();
			let first: ListIterator<T> = null;

			for (let i: number = 0; i < size; i++) 
			{
				// CONSTRUCT ITEM, THE NEW ELEMENT
				let item: ListIterator<T> = new ListIterator(this, prev, null, val);
				if (i == 0) 
					first = item;
				
				prev.setNext(item);
				
				// SHIFT ITEM LEFT TO BE PREV
				prev = item;
			}

			// IF WAS EMPTY, VAL IS THE BEGIN
			if (this.empty() == true || first.prev().equals(this.end()) == true)
				this.begin_ = first;

			// CONNECT BETWEEN LAST INSERTED ITEM AND POSITION
			prev.setNext(position);
			position.setPrev(prev);

			this.size_ += size;

			return first;
		}

		/**
		 * @hidden
		 */
		private insert_by_range<U extends T, InputIterator extends base.container.Iterator<U>>
			(position: ListIterator<T>, begin: InputIterator, end: InputIterator): ListIterator<T>
		{
			if (this != position.get_source())
				throw new InvalidArgument("Parametric iterator is not this container's own.");

			let prev: ListIterator<T> = <ListIterator<T>>position.prev();
			let first: ListIterator<T> = null;

			let size: number = 0;

			for (let it = begin; it.equals(end) == false; it = it.next() as InputIterator) 
			{
				// CONSTRUCT ITEM, THE NEW ELEMENT
				let item: ListIterator<T> = new ListIterator(this, prev, null, it.value);

				if (size == 0) first = item;
				if (prev != null) prev.setNext(item);

				// SHIFT CURRENT ITEM TO PREVIOUS
				prev = item;
				size++;
			}

			// IF WAS EMPTY, FIRST ELEMENT IS THE BEGIN
			if (this.empty() == true)
				this.begin_ = first;

			// CONNECT BETWEEN LAST AND POSITION
			prev.setNext(position);
			position.setPrev(prev);

			this.size_ += size;

			return first;
		}

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * <p> Erase an element. </p>
		 *
		 * <p> Removes from the {@link List} either a single element; <i>position</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of element removed. </p>
		 *
		 * <p> Unlike other standard sequence containers, {@link List} objects are specifically designed to be 
		 * efficient inserting and removing elements in any position, even in the middle of the sequence. </p>
		 * 
		 * @param position Iterator pointing to a single element to be removed from the {@link List}.
		 *
		 * @return An iterator pointing to the element that followed the last element erased by the function call. 
		 *		   This is the {@link end end()} if the operation erased the last element in the sequence.
		 */
		public erase(position: ListIterator<T>): ListIterator<T>;
		
		/**
		 * <p> Erase elements. </p>
		 *
		 * <p> Removes from the {@link List} container a range of elements. </p>
		 *
		 * <p> This effectively reduces the container {@link size} by the number of elements removed. </p>
		 *
		 * <p> Unlike other standard sequence containers, {@link List} objects are specifically designed to be 
		 * efficient inserting and removing elements in any position, even in the middle of the sequence. </p>
		 *
		 * @param begin An iterator specifying a range of beginning to erase.
		 * @param end An iterator specifying a range of end to erase.
		 * 
		 * @return An iterator pointing to the element that followed the last element erased by the function call. 
		 *		   This is the {@link end end()} if the operation erased the last element in the sequence.
		 */
		public erase(begin: ListIterator<T>, end: ListIterator<T>): ListIterator<T>;

		public erase(...args: any[]): ListIterator<T>
		{
			if (args.length == 1)
				return this.erase_by_iterator(args[0]);
			else if (args.length == 2)
				return this.erase_by_range(args[0], args[1]);
		}

		/**
		 * @hidden
		 */
		private erase_by_iterator(it: ListIterator<T>): ListIterator<T>
		{
			return this.erase_by_range(it, it.next());
		}

		/**
		 * @hidden
		 */
		private erase_by_range(begin: ListIterator<T>, end: ListIterator<T>): ListIterator<T>
		{
			if (this != begin.get_source() || begin.get_source() != end.get_source())
				throw new InvalidArgument("Parametric iterator is not this container's own.");

			// FIND PREV AND NEXT
			let prev: ListIterator<T> = <ListIterator<T>>begin.prev();

			// CALCULATE THE SIZE
			let size: number = 0;

			for (let it = begin; it.equals(end) == false; it = it.next())
				size++;

			// SHRINK
			prev.setNext(end);
			end.setPrev(prev);

			this.size_ -= size;
			if (this.size_ == 0)
				this.begin_ = end;

			return end;
		}

		/* ===============================================================
			ALGORITHMS
				- UNIQUE & REMOVE (IF)
				- MERGE & SPLICE
				- SORT
				- SWAP
		==================================================================
			UNIQUE & REMOVE (IF)
		--------------------------------------------------------------- */
		/**
		 * <p> Remove duplicate values. </p>
		 *
		 * <p> Removes all but the first element from every consecutive group of equal elements in the container. </p>
		 *
		 * <p> Notice that an element is only removed from the {@link List} container if it compares equal to the 
		 * element immediately preceding it. Thus, this function is especially useful for sorted lists. </p>
		 */
		public unique(): void;

		/**
		 * <p> Remove duplicate values. </p>
		 * 
		 * <p> Removes all but the first element from every consecutive group of equal elements in the container. </p>
		 * 
		 * <p> The argument <i>binary_pred</i> is a specific comparison function that determine the <u>uniqueness</u> 
		 * of an element. In fact, any behavior can be implemented (and not only an equality comparison), but notice 
		 * that the function will call <code>binary_pred(it.value, it.prev().value)</code> for all pairs of elements 
		 * (where <code>it</code> is an iterator to an element, starting from the second) and remove <code>it</code> 
		 * from the {@link List} if the predicate returns <code>true</code>.
		 *
		 * <p> Notice that an element is only removed from the {@link List} container if it compares equal to the 
		 * element immediately preceding it. Thus, this function is especially useful for sorted lists. </p>
		 * 
		 * @param binary_pred Binary predicate that, taking two values of the same type than those contained in the 
		 *					  {@link List}, returns <code>true</code> to remove the element passed as first argument 
		 *					  from the container, and <code>false</code> otherwise. This shall be a function pointer 
		 *					  or a function object.
		 */
		public unique(binary_pred: (left: T, right: T) => boolean): void;

		public unique(binary_pred: (left: T, right: T) => boolean = std.equals): void
		{
			let it = this.begin().next();

			while (!it.equals(this.end()))
			{
				if (std.equals(it.value, it.prev().value) == true)
					it = this.erase(it);
				else
					it = it.next();
			}
		}

		/**
		 * <p> Remove elements with specific value. </p>
		 * 
		 * <p> Removes from the container all the elements that compare equal to <i>val</i>. This calls the 
		 * destructor of these objects and reduces the container {@link size} by the number of elements removed. </p>
		 * 
		 * <p> Unlike member function {@link List.erase}, which erases elements by their position (using an 
		 * iterator), this function ({@link List.remove}) removes elements by their value. </p>
		 * 
		 * <p> A similar function, {@link List.remove_if}, exists, which allows for a condition other than an 
		 * equality comparison to determine whether an element is removed. </p>
		 *
		 * @param val Value of the elements to be removed.
		 */
		public remove(val: T): void
		{
			let it = this.begin();

			while (!it.equals(this.end()))
			{
				if (std.equals(it.value, val) == true)
					it = this.erase(it);
				else
					it = it.next();
			}
		}

		/**
		 * <p> Remove elements fulfilling condition. </p>
		 * 
		 * <p> Removes from the container all the elements for which <i>pred</i> returns <code>true</code>. This 
		 * calls the destructor of these objects and reduces the container {@link size} by the number of elements 
		 * removed. </p>
		 * 
		 * <p> The function calls <code>pred(it.value)</code> for each element (where <code>it</code> is an iterator 
		 * to that element). Any of the elements in the list for which this returns <code>true</code>, are removed 
		 * from the container. </p>
		 * 
		 * @param pred Unary predicate that, taking a value of the same type as those contained in the forward_list 
		 *			   object, returns <code>true</code> for those values to be removed from the container, and 
		 *			   <code>false</code> for those remaining. This can either be a function pointer or a function 
		 *			   object.
		 */
		public remove_if(pred: (val: T) => boolean): void
		{
			let it = this.begin();

			while (!it.equals(this.end()))
			{
				if (pred(it.value) == true)
					it = this.erase(it);
				else
					it = it.next();
			}
		}

		/* ---------------------------------------------------------
			MERGE & SPLICE
		--------------------------------------------------------- */
		/**
		 * <p> Merge sorted {@link List Lists}. </p>
		 *
		 * <p> Merges <i>obj</i> into the {@link List} by transferring all of its elements at their respective 
		 * ordered positions into the container (<font color='red'>both containers shall already be ordered</font>). 
		 * </p>
		 * 
		 * <p> This effectively removes all the elements in <i>obj</i> (which becomes {@link empty}), and inserts 
		 * them into their ordered position within container (which expands in {@link size} by the number of elements 
		 * transferred). The operation is performed without constructing nor destroying any element: they are 
		 * transferred, no matter whether <i>obj</i> is an lvalue or an rvalue, or whether the value_type supports 
		 * move-construction or not. </p>
		 * 
		 * <p> This function requires that the {@link List} containers have their elements already ordered by value 
		 * ({@link less}) before the call. For an alternative on unordered {@link List Lists}, see 
		 * {@link List.splice}. </p>
		 * 
		 * <p> Assuming such ordering, each element of <i>obj</i> is inserted at the position that corresponds to its 
		 * value according to the strict weak ordering defined by {@link less}. The resulting order of equivalent 
		 * elements is stable (i.e., equivalent elements preserve the relative order they had before the call, and 
		 * existing elements precede those equivalent inserted from <i>obj</i>). </p>
		 * 
		 * The function does nothing if <code>this == obj</code>.
		 * 
		 * @param obj A {@link List} object of the same type (i.e., with the same template parameters, <b>T</b>).
		 * 			  Note that this function modifies <i>obj</i> no matter whether an lvalue or rvalue reference is 
		 *			  passed.
		 */
		public merge<U extends T>(obj: List<U>): void;

		/**
		 * <p> Merge sorted {@link List Lists}. </p>
		 *
		 * <p> Merges <i>obj</i> into the {@link List} by transferring all of its elements at their respective 
		 * ordered positions into the container (<font color='red'>both containers shall already be ordered</font>). 
		 * </p>
		 * 
		 * <p> This effectively removes all the elements in <i>obj</i> (which becomes {@link empty}), and inserts 
		 * them into their ordered position within container (which expands in {@link size} by the number of elements 
		 * transferred). The operation is performed without constructing nor destroying any element: they are 
		 * transferred, no matter whether <i>obj</i> is an lvalue or an rvalue, or whether the value_type supports 
		 * move-construction or not. </p>
		 *
		 * <p> The argument <i>compare</i> is a specific predicate to perform the comparison operation between 
		 * elements. This comparison shall produce a strict weak ordering of the elements (i.e., a consistent 
		 * transitive comparison, without considering its reflexiveness).
		 * 
		 * <p> This function requires that the {@link List} containers have their elements already ordered by 
		 * <i>compare</i> before the call. For an alternative on unordered {@link List Lists}, see 
		 * {@link List.splice}. </p>
		 * 
		 * <p> Assuming such ordering, each element of <i>obj</i> is inserted at the position that corresponds to its 
		 * value according to the strict weak ordering defined by <i>compare</i>. The resulting order of equivalent 
		 * elements is stable (i.e., equivalent elements preserve the relative order they had before the call, and 
		 * existing elements precede those equivalent inserted from <i>obj</i>). </p>
		 * 
		 * The function does nothing if <code>this == obj</code>.
		 * 
		 * @param obj A {@link List} object of the same type (i.e., with the same template parameters, <b>T</b>).
		 * 			  Note that this function modifies <i>obj</i> no matter whether an lvalue or rvalue reference is 
		 *			  passed.
		 * @param compare Binary predicate that, taking two values of the same type than those contained in the 
		 *				  {@link list}, returns <code>true</code> if the first argument is considered to go before 
		 *				  the second in the strict weak ordering it defines, and <code>false</code> otherwise. 
		 *				  This shall be a function pointer or a function object.
		 */
		public merge<U extends T>(obj: List<U>, compare: (left: T, right: T) => boolean): void;

		public merge<U extends T>(obj: List<U>, compare: (left: T, right: T) => boolean = std.less): void
		{
			if (this == <List<T>>obj)
				return;

			let it = this.begin();

			while (obj.empty() == false)
			{
				let begin = obj.begin();
				while (!it.equals(this.end()) && compare(it.value, begin.value) == true)
					it = it.next();

				this.splice(it, obj, begin);
			}
		}

		/**
		 * <p> Transfer elements from {@link List} to {@link List}. </p>
		 * 
		 * <p> Transfers elements from <i>obj</i> into the container, inserting them at <i>position</i>. </p>
		 * 
		 * <p> This effectively inserts all elements into the container and removes them from <i>obj</i>, altering 
		 * the sizes of both containers. The operation does not involve the construction or destruction of any 
		 * element. They are transferred, no matter whether <i>obj</i> is an lvalue or an rvalue, or whether the 
		 * value_type supports move-construction or not. </p>
		 *
		 * <p> This first version (1) transfers all the elements of <i>obj</i> into the container. </p>
		 * 
		 * @param position Position within the container where the elements of <i>obj</i> are inserted.
		 * @param obj A {@link List} object of the same type (i.e., with the same template parameters, <b>T</b>).
		 */
		public splice<U extends T>(position: ListIterator<T>, obj: List<U>): void;
		
		/**
		 * <p> Transfer an element from {@link List} to {@link List}. </p>
		 * 
		 * <p> Transfers an element from <i>obj</i>, which is pointed by an {@link ListIterator iterator} <i>it</i>, 
		 * into the container, inserting the element at specified <i>position</i>. </p>
		 * 
		 * <p> This effectively inserts an element into the container and removes it from <i>obj</i>, altering the 
		 * sizes of both containers. The operation does not involve the construction or destruction of any element. 
		 * They are transferred, no matter whether <i>obj</i> is an lvalue or an rvalue, or whether the value_type 
		 * supports move-construction or not. </p>
		 *
		 * <p> This second version (2) transfers only the element pointed by <i>it</i> from <i>obj</i> into the 
		 * container. </p>
		 * 
		 * @param position Position within the container where the element of <i>obj</i> is inserted.
		 * @param obj A {@link List} object of the same type (i.e., with the same template parameters, <b>T</b>).
		 *			  This parameter may be <code>this</code> if <i>position</i> points to an element not actually 
		 *			  being spliced.
		 * @param it {@link ListIterator Iterator} to an element in <i>obj</i>. Only this single element is 
		 *			 transferred.
		 */
		public splice<U extends T>(position: ListIterator<T>, obj: List<U>, it: ListIterator<U>): void;
		
		/**
		 * <p> Transfer elements from {@link List} to {@link List}. </p>
		 *
		 * <p> Transfers elements from <i>obj</i> into the container, inserting them at <i>position</i>. </p>
		 *
		 * <p> This effectively inserts those elements into the container and removes them from <i>obj</i>, altering 
		 * the sizes of both containers. The operation does not involve the construction or destruction of any 
		 * element. They are transferred, no matter whether <i>obj</i> is an lvalue or an rvalue, or whether the 
		 * value_type supports move-construction or not. </p>
		 *
		 * <p> This third version (3) transfers the range [<i>begin</i>, <i>end</i>] from <i>obj</i> into the 
		 * container. </p>
		 * 
		 * @param position Position within the container where the elements of <i>obj</i> are inserted.
		 * @param obj A {@link List} object of the same type (i.e., with the same template parameters, <b>T</b>).
		 *			  This parameter may be <code>this</code> if <i>position</i> points to an element not actually
		 *			  being spliced.
		 * @param begin {@link ListIterator An Iterator} specifying initial position of a range of elements in
		 *				<i>obj</i>. Transfers the elements in the range [<b><i>begin</i></b>, <i>end</i>) to 
		 *				<i>position</i>.
		 * @param end {@link ListIterator An Iterator} specifying final position of a range of elements in
		 *			  <i>obj</i>. Transfers the elements in the range [<i>begin</i>, <b><i>end</i></b>) to
		 *			  <i>position</i>. Notice that the range includes all the elements between <i>begin<i/> and 
		 *			  <i>end</i>, including the element pointed by <i>begin</i> but not the one pointed by <i>end</i>.
		 */
		public splice<U extends T>
			(position: ListIterator<T>, obj: List<U>, begin: ListIterator<U>, end: ListIterator<U>): void;

		public splice<U extends T>
			(
				position: ListIterator<T>, obj: List<U>, 
				begin: ListIterator<U> = null, end: ListIterator<U> = null): void
		{
			if (begin == null)
			{
				begin = obj.begin();
				end = obj.end();
			}
			else if (end == null)
			{
				end = begin.next();
			}

			this.insert(position, begin, end);
			obj.erase(begin, end);
		}

		/* ---------------------------------------------------------
			SORT
		--------------------------------------------------------- */
		/**
		 * <p> Sort elements in container. </p>
		 * 
		 * <p> Sorts the elements in the {@link List}, altering their position within the container. </p>
		 * 
		 * <p> The sorting is performed by applying an algorithm that uses {@link less}. This comparison shall 
		 * produce a strict weak ordering of the elements (i.e., a consistent transitive comparison, without 
		 * considering its reflexiveness). </p>
		 * 
		 * <p> The resulting order of equivalent elements is stable: i.e., equivalent elements preserve the relative 
		 * order they had before the call. </p>
		 * 
		 * <p> The entire operation does not involve the construction, destruction or copy of any element object. 
		 * Elements are moved within the container. </p>
		 */
		public sort(): void;

		/**
		 * <p> Sort elements in container. </p>
		 * 
		 * <p> Sorts the elements in the {@link List}, altering their position within the container. </p>
		 * 
		 * <p> The sorting is performed by applying an algorithm that uses <i>compare</i>. This comparison shall 
		 * produce a strict weak ordering of the elements (i.e., a consistent transitive comparison, without 
		 * considering its reflexiveness). </p>
		 * 
		 * <p> The resulting order of equivalent elements is stable: i.e., equivalent elements preserve the relative 
		 * order they had before the call. </p>
		 * 
		 * <p> The entire operation does not involve the construction, destruction or copy of any element object. 
		 * Elements are moved within the container. </p>
		 *
		 * @param compare Binary predicate that, taking two values of the same type of those contained in the 
		 *				  {@link List}, returns <code>true</code> if the first argument goes before the second 
		 *				  argument in the strict weak ordering it defines, and <code>false</code> otherwise. This 
		 *				  shall be a function pointer or a function object.
		 */
		public sort(compare: (left: T, right: T) => boolean): void;

		public sort(compare: (left: T, right: T) => boolean = std.less): void
		{
			//let whole: Vector<T> = new Vector<T>(this);
			//let part: Vector<T> = new Vector<T>(this);

			//this.msort(whole, part, 0, this.size(), compare);
			//this.assign(whole.begin(), whole.end());

			let vector: Vector<T> = new Vector<T>(this.begin(), this.end());
			sort(vector.begin(), vector.end());

			this.assign(vector.begin(), vector.end());
		}

		///**
		// * @hidden
		// */
		//private msort
		//	(
		//		whole: Array<T>, part: Array<T>, 
		//		begin: number, end: number, compare: (left: T, right: T) => boolean
		//	): void
		//{
		//	if (begin >= end - 1)
		//		return;

		//	let mid = begin + Math.floor((end - begin) / 2);

		//	this.msort(whole, part, begin, mid, compare);
		//	this.msort(whole, part, mid, end, compare);

		//	this.msort_merge(whole, part, begin, mid, end, compare);
		//}

		///**
		// * @hidden
		// */
		//private msort_merge
		//	(
		//		whole: Array<T>, part: Array<T>, 
		//		begin: number, mid: number, end: number, 
		//		compare: (left: T, right: T) => boolean
		//	): void
		//{
		//	for (let i: number = begin; i < end; i++)
		//		part[i] = whole[i];

		//	let x: number = begin;
		//	let y: number = mid;

		//	for (let i: number = mid; i < end; i++)
		//	{
		//		if (x >= mid)
		//			whole[i] = part[y++];
		//		else if (y >= end)
		//			whole[i] = part[x++];
		//		else if (part[x] < part[y])
		//			whole[i] = part[y++];
		//		else
		//			whole[i] = part[x++];
		//	}
		//}

		/* ---------------------------------------------------------
			SWAP
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public swap(obj: base.container.IContainer<T>): void
		{
			if (obj instanceof List)
				this.swap_list(obj);
			else
				super.swap(obj);
		}

		/**
		 * @hidden
		 */
		private swap_list(obj: List<T>): void
		{
			let supplement: List<T> = <List<T>>new Object();
			supplement.begin_ = this.begin_;
			supplement.end_ = this.end_;
			supplement.size_ = this.size_;

			this.begin_ = obj.begin_;
			this.end_ = obj.end_;
			this.size_ = obj.size_;

			obj.begin_ = supplement.begin_;
			obj.end_ = supplement.end_;
			obj.size_ = supplement.size_;
		}
	}
}