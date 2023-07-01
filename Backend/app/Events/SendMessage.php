<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $channel1, $channel2, $eventName, $message;
    /**
     * Create a new event instance.
     */
    public function __construct($channel1, $channel2, $eventName, $message)
    {
        $this->channel1 = $channel1;
        $this->channel2 = $channel2;
        $this->eventName = $eventName;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel($this->channel1),
            new PresenceChannel($this->channel2),
        ];
    }

    public function broadcastAs()
    {
        return $this->eventName;
    }
}
