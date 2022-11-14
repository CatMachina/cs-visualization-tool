export default class Heap 
{
    constructor (sort = function(a, b){return a < b}) 
    {
        this.arr = [];
        this.sort = sort;
    }
    insert(element) 
    {
        this.arr.push(element);
        this.pullup(this.arr.length - 1);
        // console.log("insert");
        // if(!this.validate())
        //     this.print();
    }
    delete() 
    {
        if(this.arr.length === 0)
            return null;
        let ret = this.arr[0];
        this.arr[0] = this.arr[this.arr.length - 1];
        this.arr.pop();
        this.pushdown(0);
        // console.log("delete");
        // if(!this.validate())
        //     this.print();
        return ret;
    }
    pullup(index) 
    {
        if(index === 0)
            return;
        const parentIndex = Math.floor((index - 1) / 2);
        if(this.sort(this.arr[index], this.arr[parentIndex]))
        {
            const tmp = this.arr[parentIndex];
            this.arr[parentIndex] = this.arr[index];
            this.arr[index] = tmp;
            this.pullup(parentIndex);
        }
    }
    pushdown(index) 
    {
        if(index >= this.arr.length)
            return;
        const lIndex = index * 2 + 1;
        const rIndex = index * 2 + 2;
        const l = (lIndex < this.arr.length) ? this.arr[lIndex] : null;
        const r = (rIndex < this.arr.length) ? this.arr[rIndex] : null;
        let better = null;
        let betterIndex = null;
        if(l !== null && r != null)
        {
            better = this.sort(l, r) ? l : r;
            betterIndex = this.sort(l, r) ? lIndex : rIndex;
        }
        else if (l !== null)
        {
            better = l;
            betterIndex = lIndex;
        }
        else if(r !== null)
        {
            better = r;
            betterIndex = rIndex;
        }
        if(better !== null && this.sort(better, this.arr[index]))
        {
            const tmp = this.arr[index];
            this.arr[index] = this.arr[betterIndex];
            this.arr[betterIndex] = tmp;
            this.pushdown(betterIndex);
        }
    }
    print() {
        console.log(this.arr.length);
        this.arr.forEach(item => { console.log(item) });
    }
    validate(index = 0) {
        if(index >= this.arr.length)
            return true;
        const lIndex = index * 2 + 1;
        const rIndex = index * 2 + 2;
        const l = (lIndex < this.arr.length) ? this.arr[lIndex] : null;
        const r = (rIndex < this.arr.length) ? this.arr[rIndex] : null;
        if(l !== null && !this.sort(this.arr[index], l))
            return false;
        if(r !== null && !this.sort(this.arr[index], r))
            return false;
        return this.validate(lIndex) && this.validate(rIndex);
    }
    empty()
    {
        return this.arr.length === 0;
    }
}