<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use App\Casts\CustomEncrypt;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'reciever_id',
        'message',
        'read_sender',
        'read_reciever',
        'conversation_id'
    ];

    public function conversation(){
        $this->BelongsTo(Conversation::class);
    }

//     protected $casts = [
//         'sender_id' => CustomEncrypt::class,
//     ];

//     public function getEncryptedAttribute($value)
//     {
//         $this->attributes['encrypted'] = Crypt::encrypt($value);
//     }
}
