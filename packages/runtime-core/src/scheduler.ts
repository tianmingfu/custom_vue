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
