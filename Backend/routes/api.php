<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::get('logout', 'logout');
});

Route::controller(ChatController::class)->group(function(){
    Route::get('ably-connection-token', 'generateAblyToken');
    Route::get('get-conversations', 'getConversations');
    Route::post('get-messages', 'getMessages');
    Route::post('send-message', 'sendMessage');
    Route::post('create-conversation', 'createConversation');
    
});
