
length = input("")
barr = []
saved = 0
sarr = []


sarr = sorted([int(raw_input()) for i in xrange(length)], reverse = True)

for i in range(0,len(sarr),3):
    arr = sarr[i : i + 3]
    if len(arr) == 3:
        smallest = arr.index(min(arr))
        del arr[smallest]
        saved += sum(arr)
    elif len(arr) < 3:
        saved += sum(arr)

print saved
