<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AttendanceScanned implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $identifier;
    public string $type;
    public string $title;
    public ?string $detail;

    public function __construct(string $identifier, string $type, string $title, ?string $detail)
    {
        $this->identifier = $identifier;
        $this->type = $type;
        $this->title = $title;
        $this->detail = $detail;
    }

    public function broadcastOn(): array
    {
        return [
        new Channel('attendance-channel'),         
        new Channel("monitor-channel.{$this->identifier}"),
        ];
    }
}