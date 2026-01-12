/*

执行步骤 1：执行 Promise.resolve()
创建一个「状态为成功」的 Promise 实例，这个操作是同步的，执行速度极快，执行完就结束。
执行步骤 2：调用 .then(flushJobs)
给这个成功的 Promise 实例，绑定一个「成功回调函数」，回调函数就是 flushJobs。
👉 此时发生了核心操作：
JS 引擎看到「Promise 的.then 回调」，直接把 flushJobs 这个函数体，放入「微任务队列」中排队，然后就不管了。
✅ 注意：这里只是「把函数丢进队列」，flushJobs函数本身此时完全没有执行，只是在排队！
执行步骤 3：主线程继续向下执行
.then() 这个调用本身是「同步操作」，调用完后，主线程会继续执行后面的同步代码，完全不会等 flushJobs。
核心结论
Promise.resolve().then(flushJobs) 的本质 = 利用 Promise 的原生特性，把 flushJobs 这个函数，「延迟」到「当前同步代码执行完毕后」执行，延迟的载体就是「微任务队列」。

*/


// 对应 promise 的 pending 状态
let isFlushPending = false

/**
 * promise.resolve()
 */
const resolvedPromise = Promise.resolve() as Promise<any>
/**
 * 当前的执行任务
 */
let currentFlushPromise: Promise<void> | null = null

/**
 * 待执行的任务队列
 */
const pendingPreFlushCbs: Function[] = []

/**
 * 队列预处理函数
 */
export function queuePreFlushCb(cb: Function) {
    console.log('pendingPreFlushCbs',pendingPreFlushCbs);
	queueCb(cb, pendingPreFlushCbs)
}

/**
 * 队列处理函数
 */
function queueCb(cb: Function, pendingQueue: Function[]) {
    // 将所有的回调函数，放入队列中
    console.log('添加pendingQueue',pendingQueue);
	pendingQueue.push(cb)
	queueFlush()
}

/**
 * 依次处理队列中执行函数
 */
function queueFlush() {
    console.log('isFlushPending',isFlushPending);
	if (!isFlushPending) {
        isFlushPending = true
        console.log('执行queueFlush',isFlushPending);
		currentFlushPromise = resolvedPromise.then(flushJobs)
	}
}

/**
 * 处理队列
 */
function flushJobs() {
    isFlushPending = false
    console.log('执行flushJobs', isFlushPending);
	flushPreFlushCbs()
}

/**
 * 依次处理队列中的任务
 */
export function flushPreFlushCbs() {
    console.log('flushPreFlushCbspendingPreFlushCbs',pendingPreFlushCbs.length);
    if (pendingPreFlushCbs.length) {
		// 去重
		let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
		// 清空就数据
		pendingPreFlushCbs.length = 0
		// 循环处理
		for (let i = 0; i < activePreFlushCbs.length; i++) {
			activePreFlushCbs[i]()
		}
	}
}
