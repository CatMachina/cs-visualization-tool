import Heap from "./heap.js";

export default class PriorityQueue 
{
    constructor(sort = function(a, b){return a < b})
    {
        this.queue = new Heap(sort);
    }
    push(element) 
    {
        this.queue.insert(element);
    }
    pop()
    {
        return this.queue.delete();
    }
    empty()
    {
        return this.queue.empty();
    }
}