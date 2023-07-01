<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Ably\AblyRest;
use Ably\Exceptions\AblyException;
use App\Events\SendMessage;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    
    public function generateAblyToken(){
        try {
            // Ably token
            $ably = new AblyRest(env('ABLY_KEY'));
            $tokenParams = [
                'capability' => [
                    '*' => ['subscribe']
                ],
                'clientId'  => Auth::user()->email
              ];
              $ablyToken = $ably->auth->createTokenRequest($tokenParams)->toArray();
      
              // Return token in response
              return $ablyToken;

            } catch (AblyException $e) {
                return response()->json(['error' => 'Ably token generation failed'], 500);
        }

    }


    public function createConversation(Request $request){
        // Validation
        $credentials = $request->validate([
            'reciever_email' => 'required|email:rfc,dns',
        ]);

        // Search for reciever
        $reciever = User::where('email', '=', $credentials['reciever_email'])->first(); 
        // TODO: Check if conversation already exists

        if($reciever){
            Conversation::create([
                'user1_id' => Auth::user()->id,
                'user2_id' => $reciever->id,
                'name' => 'dm-'.Auth::user()->email.'-'.$reciever->email
            ]);
            return response()->json(['success' => 'Conversation Created Successfully']);
        }else{
            return response()->json(['error' => 'User does not exist!'], 404);
         
        }
    }
    
    public function deleteConversations(){}

    public function getConversations(){
        $conversations = Conversation::where(function ($query) {
            $query->where('user1_id', Auth::user()->id)
            ->orWhere('user2_id', Auth::user()->id);
        })->get(['id','name']);
            // $conversations = Auth::user()->conversations;
        return response()->json(["convos" => $conversations]);
    }

    public function getMessages(Request $request){
        // Find conversation
        $conversation = Conversation::where('name', '=', $request->chat_id)->first();
        // // Find messages
        $messages = $conversation->messages()->select('id', 'sender_id', 'message')->get();

        
        // $messages = "123";
        return response()->json(["messages" => $messages]);
    }

    public function sendMessage(Request $request) {
        // Todo: Write helpers
        // Find conversation
        $conversation = Conversation::where('name', '=', $request->chat_id)->first();

        $sender = $request->user();
        // Find Reciever
        if($sender->id == $conversation->user1->id){
            $reciever = $conversation->user2;        
        }else{
            $reciever = $conversation->user1;                    
        }

        // Create Message and pass conversation id
        $message = Message::create([
            'sender_id' => $sender->id,
            'reciever_id' => $reciever->id,
            'message' => $request->message,
            // Todo: make true default in migration
            'read_sender' => true,
            // Todo: make false default in migration
            'read_reciever' => false,
            'conversation_id' => $conversation->id
        ]);

        $ablyMessage = [
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'message' => $message->message, 
        ];

        // Broadcast message on ably channel
        broadcast(new SendMessage($sender->email, $reciever->email, $conversation->name, $ablyMessage));
        // Return response
        return response()->json($ablyMessage, 200);
    }
}
