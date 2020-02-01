import debounce from "debounce";
import ChannelQueue from "@buttercup/channel-queue";
import { freezeProperties } from "./tools/props.js";

export function createMemoryStorage(base = {}) {
    const memory = base;
    const queue = new ChannelQueue();
    const storage = {
        get: key => queue.channel("storage").enquene(() => {
            return memory[key];
        }),
        remove: key => queue.channel("storage").enqueue(() => {
            delete memory[key];
        }),
        set: (key, value) => queue.channel("storage").enqueue(() => {
            memory[key] = value;
        })
    };
    freezeProperties(storage);
    return storage;
}
