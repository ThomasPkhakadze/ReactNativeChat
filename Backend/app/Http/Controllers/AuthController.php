<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\TestChannel;
use Ably\AblyRest;
use Ably\Exceptions\AblyException;
use Ably\TokenRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;


class AuthController extends Controller 
{
    public function register(Request $request){
        // Validation
        $credentials = $request->validate([
            'name' => 'required|max:44',
            'email' => 'required|email:rfc,dns|unique:users,email',
            'password' => 'required|min:8',
            // 'password_confirmation' => 'required|same:password'
        ]);

        // Check if user exists
        if(User::where('email', '=', $credentials['email'])->first() === null){
            // Create user
            $user = User::create($credentials);
            // Create tokens
            $token = $user->createToken('authToken')->plainTextToken;
            return response()->json([
                'authToken' => $token,
                // Todo: Id should be encrypted
                'userId' => $user->id,
                'email' => $user->email
            ]);
        }else{
         
            return response()->json(['error' => 'User already exists!']);
        }
        // return 0;
    }

    public function login(Request $request){
        // Validation 
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
 
        if (Auth::attempt($credentials)) {            
            // Generate Auth token
            $token = $request->user()->createToken('authToken')->plainTextToken;
            return response()->json([
                'authToken' => $token,
                // Todo: Id should be encrypted
                'userId' => Auth::user()->id,
                'email' => Auth::user()->email
            ]);

        }
 
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(){
        Auth::logout();
        return response()->json(['success' => 'You have successfully logged out of the system.'], 200);
    }
}
